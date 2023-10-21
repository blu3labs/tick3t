const { ethers } = require("hardhat");
const { parseEther, parseUnits, formatEther, randomBytes } = require("ethers/utils");

async function main() {
    const [deployer, account2] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
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

    const name = "name";
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

    const buy1 = await erc721event.connect(account2).buy([1],[deployerAddress], {value: parseEther("0.04")});
    await buy1.wait();
    console.log("Buy 1");
    const buy2 = await erc1155event.connect(account2).buy(1,[deployerAddress],[1], {value: parseEther("0.04")});
    await buy2.wait();
    console.log("Buy 2");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    }
);