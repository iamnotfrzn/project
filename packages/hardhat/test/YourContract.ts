import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { DigitalContentStore } from "../typechain-types";

describe("DigitalContentStore", function () {
  let store: DigitalContentStore;
  let owner: HardhatEthersSigner;
  let buyer: HardhatEthersSigner;

  beforeEach(async function () {
    // Деплой смарт-контракта перед каждым тестом
    [owner, buyer] = await ethers.getSigners();
    const DigitalContentStore = await ethers.getContractFactory("DigitalContentStore");
    store = await DigitalContentStore.deploy();
    await store.waitForDeployment();
  });

  it("should allow adding new content", async function () {
    // Проверяем возможность добавления контента
    await expect(store.addContent("Test Content", "QmTestHash", ethers.parseEther("1")))
      .to.emit(store, "ContentAdded")
      .withArgs(1, "Test Content", ethers.parseEther("1"), owner.address);

    const content = await store.contents(1);
    expect(content.name).to.equal("Test Content");
    expect(content.ipfsHash).to.equal("QmTestHash");
    expect(content.price).to.equal(ethers.parseEther("1"));
    expect(content.creator).to.equal(owner.address);
  });

  it("should allow purchasing content", async function () {
    // Добавляем контент
    await store.addContent("Test Content", "QmTestHash", ethers.parseEther("1"));

    // Покупаем контент
    await expect(store.connect(buyer).purchaseContent(1, { value: ethers.parseEther("1") }))
      .to.emit(store, "ContentPurchased")
      .withArgs(1, buyer.address);

    // Проверяем доступ
    const hasAccess = await store.hasAccess(buyer.address, 1);
    expect(hasAccess).to.be.equal(true);
  });

  it("should deny access to content if not purchased", async function () {
    // Добавляем контент
    await store.addContent("Test Content", "QmTestHash", ethers.parseEther("1"));

    // Проверяем доступ без покупки
    await expect(store.connect(buyer).getContent(1)).to.be.revertedWith("Access is denied");
  });

  it("should return IPFS hash after purchase", async function () {
    // Добавляем контент
    await store.addContent("Test Content", "QmTestHash", ethers.parseEther("1"));

    // Покупаем контент
    await store.connect(buyer).purchaseContent(1, { value: ethers.parseEther("1") });

    // Получаем контент
    const ipfsHash = await store.connect(buyer).getContent(1);
    expect(ipfsHash).to.equal("QmTestHash");
  });

  it("should reject duplicate purchases", async function () {
    // Добавляем контент
    await store.addContent("Test Content", "QmTestHash", ethers.parseEther("1"));

    // Покупаем контент
    await store.connect(buyer).purchaseContent(1, { value: ethers.parseEther("1") });

    // Повторная покупка должна быть отклонена
    await expect(store.connect(buyer).purchaseContent(1, { value: ethers.parseEther("1") })).to.be.revertedWith(
      "Already purchased",
    );
  });

  it("should reject incorrect payment amount", async function () {
    // Добавляем контент
    await store.addContent("Test Content", "QmTestHash", ethers.parseEther("1"));

    // Попытка покупки с неправильной суммой должна быть отклонена
    await expect(store.connect(buyer).purchaseContent(1, { value: ethers.parseEther("0.5") })).to.be.revertedWith(
      "Incorrect payment amount",
    );
  });
});
