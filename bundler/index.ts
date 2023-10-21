import {
    JsonRpcProvider
  } from "@ethersproject/providers";
import Bao from "baojs";
import { BigNumber, Contract, ethers } from "ethers";
import { SafeTransaction, SafeTransactionData } from "@safe-global/safe-core-sdk-types";
import {
    Tick3tTransaction,
    getEncodedTransaction,
    getSafeContract,
    getSafeProxyFactoryContract,
  } from "./contracts/safeContract";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const provider = new JsonRpcProvider(
  "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
);
const globalBundlerSigner = new ethers.Wallet(PRIVATE_KEY, provider);
type SafeTx = SafeTransaction & { signatures: string; from: string };


const app = new Bao();

// cors handler
app.after(async (ctx) => {
    if (ctx.res === null) {
      throw new Error("ctx.res is null");
    }
  
    // CORS
    ctx.res.headers.set("Access-Control-Allow-Origin", "*");
    ctx.res.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    ctx.res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  
    return ctx;
});

app.post("/create-smartaccount", async (context) => {
  const response: SafeTx = await context.req.json();


  const ticketTransaction: Tick3tTransaction = {
    to: response?.data?.to,
    value: response.data.value,
    data: response.data?.data,
    operation: response.data?.operation,
    safeTxGas: response.data?.safeTxGas,
    baseGas: response.data?.baseGas,
    gasPrice: response.data?.gasPrice,
    gasToken: response.data?.gasToken,
    refundReceiver: response.data?.refundReceiver,
    nonce: response.data?.nonce,
    signatures: response.signatures,
    from: response.from,
  };
  console.log(ticketTransaction)

  const encodedTransaction = await getEncodedTransaction(
    ticketTransaction,
    globalBundlerSigner
  );


  const safeProxy = getSafeProxyFactoryContract(globalBundlerSigner);
  try {
 
    console.log(encodedTransaction, ticketTransaction)
    console.log("Smart account creation in process....");
    const tx = await globalBundlerSigner.sendTransaction({
      data: encodedTransaction,
      to: safeProxy.address,
      gasLimit: 10000000,
    });

    
    const Result = await tx.wait();

    const addressOfProxy = Result.logs[0].address
    return context.sendJson({smartAccountAddress: addressOfProxy})
  } catch (err) {
    console.log(err, "error");
    return context.sendJson({
        result: "error_creation",
        error:err
      });
  }

});

//Endpoint for execution from a smart account
app.post("/send-tx", async (context) =>{

    const reqData: SafeTransactionData & {signature:string, address:string} = await context.req.json() 
    const safeContract = getSafeContract(reqData?.address, globalBundlerSigner)



    const correctTx = {
        to: reqData.to,
        value: reqData.value,
        data: reqData.data,
        operation: reqData.operation,
        safeTxGas: reqData.safeTxGas,
        baseGas: reqData.baseGas,
        gasPrice: reqData.gasPrice,
        gasToken: reqData.gasToken,
        refundReceiver: reqData.refundReceiver,
        signatures: reqData.signature,
    }

    const args = Object.values(correctTx)
    
    try {
     const tx = await safeContract.execTransaction(...args,{gasLimit:5000000})
     // we will wait that the transaction is mined.
   const data =  await tx.wait()
    return context.sendJson({result:"Transaction sent successfuly.", tx: data})
    }catch(err){
        console.log(err)
        return context.sendJson({result:"err", error:err})
    }
})


app.listen({
    port: parseInt(process.env.PORT!) || 3000,
});
  