const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KeyDrop Contract Tests", function () {
  let keyDrop;
  let deployer;
  let alice;
  let bob;
  let charlie;

  beforeEach(async function () {
    [deployer, alice, bob, charlie] = await ethers.getSigners();
    const KeyDropFactory = await ethers.getContractFactory("KeyDrop");
    keyDrop = await KeyDropFactory.deploy();
    await keyDrop.waitForDeployment();
  });

  // 1. The contract deploys successfully.
  it("1. The contract deploys successfully", async function () {
    const address = await keyDrop.getAddress();
    expect(address).to.be.properAddress;
    expect(address).to.not.equal(ethers.ZeroAddress);
  });

  // 2. The initial message count is zero.
  it("2. The initial message count is zero", async function () {
    const total = await keyDrop.getTotalMessages();
    expect(total).to.equal(0n);
    expect(await keyDrop.getSentMessageCount(alice.address)).to.equal(0n);
    expect(await keyDrop.getReceivedMessageCount(bob.address)).to.equal(0n);
  });

  // 3. A user can send a message.
  it("3. A user can send a message", async function () {
    const tx = await keyDrop.connect(alice).sendMessage(bob.address, "Hello Bob!");
    await tx.wait();

    const total = await keyDrop.getTotalMessages();
    expect(total).to.equal(1n);
  });

  // 4. The sender is recorded correctly.
  it("4. The sender is recorded correctly", async function () {
    await keyDrop.connect(alice).sendMessage(bob.address, "Check sender");
    const msg = await keyDrop.getMessage(1);
    expect(msg.sender).to.equal(alice.address);
  });

  // 5. The recipient is recorded correctly.
  it("5. The recipient is recorded correctly", async function () {
    await keyDrop.connect(alice).sendMessage(bob.address, "Check recipient");
    const msg = await keyDrop.getMessage(1);
    expect(msg.recipient).to.equal(bob.address);
  });

  // 6. The message content is stored correctly.
  it("6. The message content is stored correctly", async function () {
    const text = "Public on-chain message on BOT Chain!";
    await keyDrop.connect(alice).sendMessage(bob.address, text);
    const msg = await keyDrop.getMessage(1);
    expect(msg.content).to.equal(text);
  });

  // 7. The timestamp is recorded.
  it("7. The timestamp is recorded", async function () {
    const tx = await keyDrop.connect(alice).sendMessage(bob.address, "Timestamp check");
    const receipt = await tx.wait();
    const block = await ethers.provider.getBlock(receipt.blockNumber);

    const msg = await keyDrop.getMessage(1);
    expect(msg.timestamp).to.equal(BigInt(block.timestamp));
    expect(msg.timestamp).to.be.greaterThan(0n);
  });

  // 8. The message ID increments correctly.
  it("8. The message ID increments correctly", async function () {
    await keyDrop.connect(alice).sendMessage(bob.address, "First");
    await keyDrop.connect(bob).sendMessage(alice.address, "Second");
    await keyDrop.connect(alice).sendMessage(charlie.address, "Third");

    expect(await keyDrop.getTotalMessages()).to.equal(3n);

    const msg1 = await keyDrop.getMessage(1);
    const msg2 = await keyDrop.getMessage(2);
    const msg3 = await keyDrop.getMessage(3);

    expect(msg1.id).to.equal(1n);
    expect(msg2.id).to.equal(2n);
    expect(msg3.id).to.equal(3n);
  });

  // 9. Sent-message indexes are correct.
  it("9. Sent-message indexes are correct", async function () {
    await keyDrop.connect(alice).sendMessage(bob.address, "Alice to Bob 1");
    await keyDrop.connect(charlie).sendMessage(bob.address, "Charlie to Bob");
    await keyDrop.connect(alice).sendMessage(charlie.address, "Alice to Charlie");

    expect(await keyDrop.getSentMessageCount(alice.address)).to.equal(2n);
    const firstSentId = await keyDrop.getSentMessageIdByIndex(alice.address, 0);
    const secondSentId = await keyDrop.getSentMessageIdByIndex(alice.address, 1);

    expect(firstSentId).to.equal(1n);
    expect(secondSentId).to.equal(3n);

    await expect(
      keyDrop.getSentMessageIdByIndex(alice.address, 2)
    ).to.be.revertedWith("Sent index out of bounds");
  });

  // 10. Received-message indexes are correct.
  it("10. Received-message indexes are correct", async function () {
    await keyDrop.connect(alice).sendMessage(bob.address, "From Alice");
    await keyDrop.connect(charlie).sendMessage(alice.address, "To Alice");
    await keyDrop.connect(charlie).sendMessage(bob.address, "From Charlie");

    expect(await keyDrop.getReceivedMessageCount(bob.address)).to.equal(2n);
    const firstReceivedId = await keyDrop.getReceivedMessageIdByIndex(bob.address, 0);
    const secondReceivedId = await keyDrop.getReceivedMessageIdByIndex(bob.address, 1);

    expect(firstReceivedId).to.equal(1n);
    expect(secondReceivedId).to.equal(3n);

    await expect(
      keyDrop.getReceivedMessageIdByIndex(bob.address, 2)
    ).to.be.revertedWith("Received index out of bounds");
  });

  // 11. Empty messages are rejected.
  it("11. Empty messages are rejected", async function () {
    await expect(
      keyDrop.connect(alice).sendMessage(bob.address, "")
    ).to.be.revertedWith("Message cannot be empty");
  });

  // 12. Messages exceeding 280 UTF-8 bytes are rejected.
  it("12. Messages exceeding 280 UTF-8 bytes are rejected", async function () {
    const exactly280Bytes = "a".repeat(280);
    const tooLong281Bytes = "a".repeat(281);

    // 280 ASCII bytes should succeed
    await expect(keyDrop.connect(alice).sendMessage(bob.address, exactly280Bytes))
      .to.not.be.reverted;

    // 281 ASCII bytes should revert
    await expect(
      keyDrop.connect(alice).sendMessage(bob.address, tooLong281Bytes)
    ).to.be.revertedWith("Message exceeds 280 bytes");

    // Multibyte UTF-8 test (e.g. emojis or special chars)
    // 71 4-byte emojis = 284 bytes -> should revert
    const multiByteOverflow = "🚀".repeat(71);
    await expect(
      keyDrop.connect(alice).sendMessage(bob.address, multiByteOverflow)
    ).to.be.revertedWith("Message exceeds 280 bytes");
  });

  // 13. The zero address cannot receive a message.
  it("13. The zero address cannot receive a message", async function () {
    await expect(
      keyDrop.connect(alice).sendMessage(ethers.ZeroAddress, "Hello zero")
    ).to.be.revertedWith("Recipient cannot be zero address");
  });

  // 14. Sending a message to the sender's own wallet is rejected.
  it("14. Sending a message to the sender's own wallet is rejected", async function () {
    await expect(
      keyDrop.connect(alice).sendMessage(alice.address, "Hello myself")
    ).to.be.revertedWith("Cannot send message to yourself");
  });

  // 15. The correct event is emitted.
  it("15. The correct event is emitted", async function () {
    const tx = await keyDrop.connect(alice).sendMessage(bob.address, "Event test");
    const receipt = await tx.wait();
    const block = await ethers.provider.getBlock(receipt.blockNumber);

    await expect(tx)
      .to.emit(keyDrop, "MessageSent")
      .withArgs(1n, alice.address, bob.address, BigInt(block.timestamp));
  });

  // Bonus test: Batch helper functions work as expected
  it("Batch helpers return complete sent and received message structures", async function () {
    await keyDrop.connect(alice).sendMessage(bob.address, "Batch 1");
    await keyDrop.connect(alice).sendMessage(bob.address, "Batch 2");

    const sent = await keyDrop.getSentMessages(alice.address);
    expect(sent.length).to.equal(2);
    expect(sent[0].content).to.equal("Batch 1");
    expect(sent[1].content).to.equal("Batch 2");

    const received = await keyDrop.getReceivedMessages(bob.address);
    expect(received.length).to.equal(2);
    expect(received[0].content).to.equal("Batch 1");
    expect(received[1].content).to.equal("Batch 2");
  });
});
