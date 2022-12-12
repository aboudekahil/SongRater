const SessionModel = require('../models/session.module');
const crypto = require('crypto');

class CookieSessionManager {
  /**
   * Creates a new instance of `CookieSessionManager`.
   *
   * @class
   *
   * This class manages sessions for users by using cookies to store session
   *  information.
   *
   * @constructor
   */
  constructor() {
    this.Session = SessionModel;
    this.defaultExpiration = 60 * 60 * 24 * 365; // 1 Year
  }

  /**
   * @async
   * @function
   * Creates a new session for the given user.
   *
   * @param {string} userId - The ID of the user to create a session for.
   * @param {number} [expiration] - The number of seconds until the session should expire.
   * If not provided, the default expiration time will be used.
   *
   * @returns {Array} An array containing the session ID and expiration time.
   * If the session could not be saved, `null` will be returned.
   */
  async createSession(userId, expiration) {
    let sessionId = this.hashId(userId);

    expiration = expiration || this.defaultExpiration;

    const expirationTime = Date.now() + expiration * 1000;

    if ((await this.getUserId(sessionId)) !== null) {
      return [sessionId, expirationTime];
    }

    const session = new this.Session({
      sessionId: sessionId,
      userId: userId,
      expiration: expirationTime,
    });

    try {
      await session.save();
      return [sessionId, expirationTime];
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /**
   * @async
   * @function
   * Gets the user ID associated with the given session ID.
   *
   * @param {string} sessionId - The session ID to look up.
   *
   * @returns {string|null} The user ID associated with the session ID, or `null` if no such
   * session exists or if the session has expired.
   */
  async getUserId(sessionId) {
    try {
      const session = await this.Session.findOne({ sessionId: sessionId });
      if (!session) {
        return null;
      }
      if (session.expiration <= Date.now()) {
        // session has expired, so delete it and return null
        await session.delete();
        return null;
      }
      return session.userId;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /**
   * @async
   * @function
   * Deletes the session with the given session ID.
   *
   * @param {string} sessionId - The session ID of the session to delete.
   *
   * @returns {boolean} `true` if the session was successfully deleted, or `false`
   * if an error occurred or if the session does not exist.
   */
  async deleteSession(sessionId) {
    try {
      const result = await this.Session.deleteOne({ sessionId });
      return result.ok === 1;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  /**
   * @async
   * @function
   * Hashes the given ID using SHA-256.
   *
   * @param {string} id - The ID to hash.
   *
   * @returns {string} The hashed ID, in hexadecimal format.
   */
  hashId(id) {
    const hash = crypto.createHash('sha256');
    hash.update(id);
    return hash.digest('hex');
  }
}

const sessionManager = new CookieSessionManager();

module.exports = sessionManager;
