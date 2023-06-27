import Bank from "../Models/bank";
import { getContract } from "../utils/web3";
import { BankDoc } from "../Models/bank";
import User from "../Models/usermodel";
import { web3client, bigNumberToNumber } from "../utils/web3";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function watcher(id: string) {
  try {
    const bankstate: any = await Bank.findById(id).populate("token");

    if (!bankstate) return;
    const getContractinitance = getContract(bankstate.token.address);

    const options: {
      fromBlock: "latest" | number;
      toBlock: "latest" | number;
    } = {
      fromBlock: 0,
      toBlock: 0,
    };

    if (
      !bankstate.uptoDateWithBlockNumber &&
      bankstate.uptoDateWithBlockNumber == 0
    ) {
      options.fromBlock = "latest";
      options.toBlock = "latest";
    } else {
      // We only do one block at a time
      const newBlockNumber = bankstate.uptoDateWithBlockNumber + 1;
      options.fromBlock = newBlockNumber;
      options.toBlock = newBlockNumber;
    }

    const decimals = await getContractinitance.decimals();

    const eventinit = await getContractinitance.filters.Transfer();
    console.log(options);
    const events = await getContractinitance.queryFilter(
      eventinit,
      options.fromBlock, //   options.fromBlock
      options.toBlock //      options.toBlock
    );
    console.log(events);

    const block = await web3client.getBlock(options.toBlock);
    if (!block) {
      return;
    }
    if (
      bankstate.uptoDateWithBlockNumber &&
      bankstate.uptoDateWithBlockNumber === block.number
    ) {
      return;
    }

    const bankTokenId = bankstate.token._id.toString();

    bankstate.uptoDateWithBlockNumber = block.number; // Assign the new block number value here
    await bankstate.save();

    // Print out all the values:
    events.forEach(async (log: any) => {
      // console.log(log.args.to, log.args.value);
      if (log.args.to == process.env.DEPOSIT) {
        const Founduser: any = await User.findOne({
          wallet: log.args.from,
        }).populate("balances.token");

        if (!Founduser) return;

        // Check if the token exists in the token balances
        const tokenBalance = Founduser.balances.find(
          (balance: any) => balance.token._id.toString() === bankTokenId
        );

        const amountodepositAA = bigNumberToNumber(log.args.value, decimals);

        if (tokenBalance) {
          // Token balance exists, update the amount
          tokenBalance.amount += amountodepositAA;
        }
        // Save the updated user
        await Founduser.save();
      }
    });

    // const usdtContract = getContract(bankstate);
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function watch(tokenIds: string[]): Promise<void> {
  console.log("start");

  (async () => {
    for await (const _ of (async function* generator() {
      while (true) {
        yield true;
      }
    })()) {
      for (const tokenId of tokenIds) {
        await watcher(tokenId);
      }

      await sleep(1000);
    }
  })();

  console.log("end..");
}
