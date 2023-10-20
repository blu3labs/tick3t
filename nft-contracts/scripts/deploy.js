const { ethers } = require("hardhat");
const { parseEther, parseUnits, formatEther } = require("ethers/utils");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", await deployer.getAddress());

    const FEE_RECIPIENT = "0x11111337E30f914859d8212c095b49fA0Ff25858";
    const FEE = parseEther("0.0001");

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
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    }
);