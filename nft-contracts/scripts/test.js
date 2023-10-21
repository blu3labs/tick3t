const { ethers } = require("hardhat");
const { parseEther, hashMessage } = require("ethers/utils");
const { signTypedData, TypedDataEncoder, verifyTypedData } = require("ethers");

const name = "name";

async function main() {
    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    // const account2Address = await account2.getAddress();
    console.log("Deploying contracts with the account:", await deployer.getAddress());

    const FEE_RECIPIENT = "0x11111337E30f914859d8212c095b49fA0Ff25858";
    const FEE = parseEther("0.01");

    const FactoryManager = await ethers.getContractFactory("FactoryManager");
    const factoryManager = await FactoryManager.deploy(FEE_RECIPIENT, FEE);
    await factoryManager.waitForDeployment();
    const factoryManagerAddress = await factoryManager.getAddress();
    console.log("Factory address:",factoryManagerAddress);

    const ERC721Factory = await ethers.getContractFactory("ERC721Factory");
    const erc721Factory = await ERC721Factory.deploy(factoryManagerAddress);
    await erc721Factory.waitForDeployment();
    console.log("ERC721Factory address:", await erc721Factory.getAddress());

    const ERC1155Factory = await ethers.getContractFactory("ERC1155Factory");
    const erc1155Factory = await ERC1155Factory.deploy(factoryManagerAddress);
    await erc1155Factory.waitForDeployment();
    console.log("ERC1155Factory address:", await erc1155Factory.getAddress());

    const SetERC721Factory = await factoryManager.setERC721Factory(erc721Factory.getAddress());
    await SetERC721Factory.wait();
    console.log("Set ERC721Factory");

    const SetERC1155Factory = await factoryManager.setERC1155Factory(erc1155Factory.getAddress());
    await SetERC1155Factory.wait();
    console.log("Set ERC1155Factory");

    const uri = "uri";
    const timestamp = await ethers.provider.getBlock("latest").then((block) => block.timestamp);
    const date = timestamp + 1000;
    const prices = [parseEther("0.03"), parseEther("0.02"), parseEther("0.01")];
    const salt = ethers.randomBytes(32);

    const CreateERC721 = await factoryManager.createERC721Event(name, uri, date, prices, salt);
    await CreateERC721.wait();
    console.log("Create ERC721");

    const CreateERC1155 = await factoryManager.createERC1155Event(name, uri, date, prices, salt);
    await CreateERC1155.wait();
    console.log("Create ERC1155");

    const getEvents = await factoryManager.getEvents();
    console.log("Events:", getEvents);

    const erc721event = await ethers.getContractAt("ERC721Event", getEvents[0]);
    const erc1155event = await ethers.getContractAt("ERC1155Event", getEvents[1]);

    const buy1 = await erc721event.connect(deployer).buy([1],[deployerAddress], {value: parseEther("0.04")});
    await buy1.wait();
    console.log("Buy 1");
    // const buy2 = await erc1155event.connect(deployer).buy(1,[deployerAddress],[1], {value: parseEther("0.04")});
    // await buy2.wait();
    // console.log("Buy 2");

    const getUserTickets = await factoryManager.getUserTickets(deployerAddress);
    // console.log("User tickets:", getUserTickets);

    const types = {
        Ticket: [
          { name: "owner", type: "address" },
          { name: "collection", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "deadline", type: "uint256" },
          { name: "salt", type: "uint256" },
        ]
      };
      const chainId = await ethers.provider.getNetwork().then((network) => network.chainId);
      console.log("ChainId:",  chainId.toString(),);
      const salt_ = generateSalt();
      const domain = {
        name: name,
        version: "1",
        chainId: chainId.toString(),
        verifyingContract: getEvents[0],
      };
      const value = {
        owner: deployerAddress,
        collection: getEvents[0],
        tokenId: 1,
        deadline: date,
        salt: salt_,
      };
      //console.log("ennnn", TypedDataEncoder);
    //   const encode = TypedDataEncoder.encode(domain, types, value);
    //     console.log("TypedDataEncoded:", encode);
        const hash = TypedDataEncoder.hash(domain, types, value);
        console.log("Hash:", hash);

        const hash2 = await erc721event.hash(
            [
                deployerAddress,
                getEvents[0],
                1,
                date,
                salt_,
                ],
            
            );
            console.log("Hash2:", hash2);

        const hash3 = await erc1155event.hash(
            [
                deployerAddress,
                getEvents[0],
                1,
                date,
                salt_,
                ],
            
            );
            console.log("Hash3:", hash3);
        
        const signature = await deployer.signTypedData(domain, types, value);
            console.log("Signature:", signature);

        const verify = verifyTypedData(
            domain,
            types,
            value,
            signature
            );
            console.log("Verify:", verify);
            console.log("Verify:", verify === deployerAddress);

        console.log("domain:", domain);
        console.log("types:", types);
        console.log("value:", value);
        
          const use = await erc721event.connect(deployer).use(
            [
                deployerAddress,
                getEvents[0],
                1,
                date,
                salt_,
                ],
            signature
            );
            await use.wait();
            console.log("Use");
}
  

function h2d(s) {
    function add(x, y) {
      var c = 0,
        r = [];
      var x = x.split("").map(Number);
      var y = y.split("").map(Number);
      while (x.length || y.length) {
        var s = (x.pop() || 0) + (y.pop() || 0) + c;
        r.unshift(s < 10 ? s : s - 10);
        c = s < 10 ? 0 : 1;
      }
      if (c) r.unshift(c);
      return r.join("");
    }

    var dec = "0";
    s.split("").forEach(function (chr) {
      var n = parseInt(chr, 16);
      for (var t = 8; t; t >>= 1) {
        dec = add(dec, dec);
        if (n & t) dec = add(dec, "1");
      }
    });
    return dec;
  }



function generateSalt() {
    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const hex = genRanHex(64)
    const dec = h2d(hex)
    return dec
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    }
);