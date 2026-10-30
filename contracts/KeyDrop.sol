// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title KeyDrop
 * @notice A decentralized, public messaging smart contract deployed on BOT Chain.
 * @dev All messages are stored permanently on-chain in plaintext. Messages are public blockchain data.
 */
contract KeyDrop {
    struct Message {
        uint256 id;
        address sender;
        address recipient;
        string content;
        uint256 timestamp;
    }

    // Total counter for messages, also serves as the unique auto-incrementing ID (1-based)
    uint256 private _totalMessages;

    // Mapping from unique message ID to Message details
    mapping(uint256 => Message) private _messages;

    // Mapping from user address to list of sent message IDs
    mapping(address => uint256[]) private _sentMessageIds;

    // Mapping from user address to list of received message IDs
    mapping(address => uint256[]) private _receivedMessageIds;

    /**
     * @notice Emitted whenever a new message is successfully recorded on-chain.
     * @param id The unique identifier of the message.
     * @param sender The address of the sender.
     * @param recipient The address of the recipient.
     * @param timestamp The block timestamp when the message was sent.
     */
    event MessageSent(
        uint256 indexed id,
        address indexed sender,
        address indexed recipient,
        uint256 timestamp
    );

    /**
     * @notice Sends a public on-chain message to a recipient wallet.
     * @param recipient The target wallet address.
     * @param content The text content of the message (max 280 UTF-8 bytes).
     * @return messageId The unique identifier generated for the message.
     */
    function sendMessage(
        address recipient,
        string calldata content
    ) external returns (uint256 messageId) {
        require(recipient != address(0), "Recipient cannot be zero address");
        require(recipient != msg.sender, "Cannot send message to yourself");
        require(bytes(content).length > 0, "Message cannot be empty");
        require(bytes(content).length <= 280, "Message exceeds 280 bytes");

        _totalMessages++;
        messageId = _totalMessages;

        _messages[messageId] = Message({
            id: messageId,
            sender: msg.sender,
            recipient: recipient,
            content: content,
            timestamp: block.timestamp
        });

        _sentMessageIds[msg.sender].push(messageId);
        _receivedMessageIds[recipient].push(messageId);

        emit MessageSent(messageId, msg.sender, recipient, block.timestamp);

        return messageId;
    }

    /**
     * @notice Returns the total count of messages created across the platform.
     */
    function getTotalMessages() external view returns (uint256) {
        return _totalMessages;
    }

    /**
     * @notice Retrieves a specific message by its unique ID.
     * @param id The unique message ID (1-based).
     */
    function getMessage(uint256 id) external view returns (Message memory) {
        require(id > 0 && id <= _totalMessages, "Message ID does not exist");
        return _messages[id];
    }

    /**
     * @notice Returns the number of messages sent by a wallet address.
     * @param user The address to check.
     */
    function getSentMessageCount(address user) external view returns (uint256) {
        return _sentMessageIds[user].length;
    }

    /**
     * @notice Returns the number of messages received by a wallet address.
     * @param user The address to check.
     */
    function getReceivedMessageCount(address user) external view returns (uint256) {
        return _receivedMessageIds[user].length;
    }

    /**
     * @notice Returns a sent message ID at a given index for a wallet.
     * @param user The address of the sender.
     * @param index The index in the user's sent messages array.
     */
    function getSentMessageIdByIndex(
        address user,
        uint256 index
    ) external view returns (uint256) {
        require(index < _sentMessageIds[user].length, "Sent index out of bounds");
        return _sentMessageIds[user][index];
    }

    /**
     * @notice Returns a received message ID at a given index for a wallet.
     * @param user The address of the recipient.
     * @param index The index in the user's received messages array.
     */
    function getReceivedMessageIdByIndex(
        address user,
        uint256 index
    ) external view returns (uint256) {
        require(index < _receivedMessageIds[user].length, "Received index out of bounds");
        return _receivedMessageIds[user][index];
    }

    /**
     * @notice Batch helper: Returns all sent messages for a user.
     * @param user The wallet address.
     */
    function getSentMessages(address user) external view returns (Message[] memory) {
        uint256[] memory ids = _sentMessageIds[user];
        uint256 length = ids.length;
        Message[] memory result = new Message[](length);

        for (uint256 i = 0; i < length; i++) {
            result[i] = _messages[ids[i]];
        }
        return result;
    }

    /**
     * @notice Batch helper: Returns all received messages for a user.
     * @param user The wallet address.
     */
    function getReceivedMessages(address user) external view returns (Message[] memory) {
        uint256[] memory ids = _receivedMessageIds[user];
        uint256 length = ids.length;
        Message[] memory result = new Message[](length);

        for (uint256 i = 0; i < length; i++) {
            result[i] = _messages[ids[i]];
        }
        return result;
    }
}
