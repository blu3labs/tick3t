# TICK3T

# Project Description
TICK3T offers a refreshing web3 user experince with the use of recent trends and new features. At its core its a ticket selling platform; what makes it special is that it uses account abstraction with a unique UX/UI and also it stores all its data inside decentralised storage which makes it possible for others to develop similar sites based on the services provided by TICK3T.

New wallet connect system makes it possible to connect with social media accounts or with metamask. Then users are able to create smart accounts to themselves for free sponsored by TICK3T. People can chose which wallet, smart account or EOA, they want to use and it will be the default wallet they are interacting with everything on the site until they change it, making it a smooth experince. Especially with the use of social media logins which even take out some signature requests from the process that turns the general experince really similar to web2.

The images that are used are stored inside the web3 storage and it uses tableland to store NFT/Event data. Currently there are two example venue options. First one is seated and use ERC721 contract to make each seat a unique NFT and then also another one with 3 categories that uses ERC1155 to create identical tickets.

The protocol also includes ticket validation with a QR code as well. Owner can sign a typed data whetever with their smart accounts or EOAs and it will be verified by an operator which takes the signarture and given information then writes a transaction inside the event contract which verifies the ownership and also checks it for double use.

Everything is automated with our custom bundler and QR verify operator. The platform also charges a small flat service fee on ticket purchases to sustain gas sponsorship.

# How it's Made
Its a ticket selling platform that utilize account abstraction. We used Safe Core Protocol with their auth kit and smart accounts. Also developed our own bundler using bun.js probably one of the few web3 projects developed with bun. Users can login with social accounts or metamask. Smart account creations and smart account transaction gas fees are sponsored by us. We also charge a small fee only on ticket buys to sustain these expenses. If the account the created with a social account the needed signatures are provided by the authkit and the user can have a seemsless experience through the app no transaction or signature needed.

We created our own wallet handling methods on the frontend with redux. The app has its unique account management system. User can pick an EOA or any smart account to be used by default on the all app can can change it any time they want. This creates a smoothless experince without any need of approving any transaction, signature or account chose for each action.

There are two venues availble now using two different nft protocols, ERC721 and ERC1155 standard. First on is a seated venue and all seats are unique nfts the other one has 3 categories as 3 nfts and user can mint identical tokens as tickets.

Event deatils are stored on chain with the use of tableland. Images are stored with the use of filecoin web3.storage. We also use d1orm for sql queiries.

For the ticket validation typed data v4 is used. Ticket owner provides a signature for the event they want to attend secured with salt and deadline. The event details and the signature used for creation of a QR code that leads to ticket verification page. On that page ticket details can be seen and scanner can click a button to verify it then it will send a request to backend with that information and our operator wallet will use these information to flag the ticket as used inside the event contract that prevents double spending. The bankend also develoepd with the use of bun.js to manage both signature verification system and also tableland queries.
