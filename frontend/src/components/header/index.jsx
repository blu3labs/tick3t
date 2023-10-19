import React from 'react'
import { Link } from 'react-router-dom'
import Logo from "@/assets/vite.svg"
import './index.css'
import { Web3Provider } from '@ethersproject/providers'
import { EthersAdapter, SafeFactory } from '@safe-global/protocol-kit'

function Header({login, authData, logout, modalProvider, setSafeAuthSignInResponse}) {
  console.log(authData)

  // authData.safes    => ARRAY OF SMART ACCOUNT
  // authData.eoa => main wallet address


  const createNewSmartAcc = async () => {
    const createNewSmartAccount = async () => {
      const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
  
      setLoading(true)
      const provider = new Web3Provider(modalProvider.getProvider())
      const signer = provider.getSigner()
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer
      })
      // const safeService = new SafeApiKit({ txServiceUrl, ethAdapter })
  
      // const signInInfo = await web3AuthModalPack?.signIn()
      const signeAddr = await signer.getAddress()
      const ownersData = [signeAddr]
      const safeFactoryC = {
        owners: ownersData,
        threshold: 1
      }
  
      // const safeFactory = await SafeFactory.create({
      //   ethAdapter
  
      // })
  
      const newSafeData = await Safe.create({
        ethAdapter,
  
        predictedSafe: {
          safeAccountConfig: safeFactoryC
        }
      })
  
  
      const relayKit = new GelatoRelayPack('_mhz0rzLWDbZ6_qEdg9c5qF50kgQ_XuKOlTFxXVdIbg_')
  
      const txNewSafe = await newSafeData.createSafeDeploymentTransaction(undefined, {
        gasLimit: 1000000
      })
      //let's create our safe smart account
  
      const safeTransactionRelay = await relayKit.createRelayedTransaction({
        safe: newSafeData,
        transactions: [{ data: txNewSafe.data, to: txNewSafe.to, value: txNewSafe.value }]
      })

      const signedSafeTransaction = await newSafeData.signTransaction(safeTransactionRelay)
  
      const sign = signedSafeTransaction.encodedSignatures()
  
      const request = await axios.post(
        'http://localhost:8081/create-smartaccount',
        JSON.stringify({ ...signedSafeTransaction, signatures: sign, from: signeAddr })
      )
  
      setLoading(false)
      const newAddress = request.data.smartAccountAddress
      setSafeAuthSignInResponse((oldData) => ({
        eoa: signeAddr,
        safes: [newAddress, ...oldData?.safes]
      }))
      toast.success('Smart Account Created:' + newAddress)
  
    }
  
  }
  return (
    <div className='header'>
      <Link to="/" className='headerLogo'>
        <img src={Logo} alt='logo' draggable='false' />
        <span>TICK3T</span>
      </Link>

      <div className='headerRightContent'>
       {  (!authData  || authData?.eoa === "" )&& <button className='connectBtn' onClick={login}>
          Connect
        </button>}
        {authData?.eoa !== "" && <a>{authData?.eoa}</a>}




        <button className='connectBtn' onClick={logout}>Logout</button>

        <button className='connectBtn' onClick={logout}>Create new Smart Account</button>
      </div>
    </div>
  )
}

export default Header