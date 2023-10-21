const { ethers } = require("hardhat");
const { parseEther, parseUnits, formatEther } = require("ethers/utils");

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log("Deploying contracts with the account:", deployerAddress);

  const timestamp = await ethers.provider
    .getBlock("latest")
    .then((block) => block.timestamp);
  const date = timestamp + 1000;
  console.log("Date:", date);


  const ERC721Event = await ethers.getContractFactory("ERC721Event");
  const event = await ERC721Event.deploy(
    "name",
    "uri",
    deployerAddress,
    parseEther("0.0001"),
    1697814004,
    [parseEther("0.00031"), parseEther("0.02"), parseEther("0.03")]
  );
  await event.waitForDeployment();
  const eventAddress = await event.getAddress();

    await new Promise((r) => setTimeout(r, 60000));

  //harhdat verify
  await hre.run("verify:verify", {
    address: eventAddress,
    constructorArguments: [
      "name",
      "uri",
      "0x11111337E30f914859d8212c095b49fA0Ff25858",
      parseEther("0.0001"),
      1697814004,
      [parseEther("0.00031"), parseEther("0.02"), parseEther("0.03")],
    ],
  });

  const ERC1155Event = await ethers.getContractFactory("ERC1155Event");
  const event2 = await ERC1155Event.deploy(
    "name",
    "uri",
    deployerAddress,
    parseEther("0.0001"),
    date,
    [parseEther("0.00031"), parseEther("0.02"), parseEther("0.03")]
  );
  await event2.waitForDeployment();
  const event2Address = await event2.getAddress();

  await new Promise((r) => setTimeout(r, 60000));

  // harhdat verify
  await hre.run("verify:verify", {
    address: event2Address,
    constructorArguments: [
      "name",
      "uri",
      deployerAddress,
      parseEther("0.0001"),
      date,
      [parseEther("0.00031"), parseEther("0.02"), parseEther("0.03")],
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
