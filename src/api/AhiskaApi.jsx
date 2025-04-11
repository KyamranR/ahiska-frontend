import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5001";

class AhiskaApi {
  static token = localStorage.getItem("token") || null;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);
    const url = `${BASE_URL}/${endpoint}`;
    const headers = {};
    if (AhiskaApi.token) {
      headers.Authorization = `Bearer ${AhiskaApi.token}`;
    }
    const params = method === "get" ? data : {};

    try {
      const response = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (error) {
      console.error("API Errors:", error.response);
      throw error.response.data;
    }
  }

  static decodeToken(token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  /** USER AUTHENTICATION */
  static async register(userData) {
    const res = await this.request("auth/register", userData, "post");
    AhiskaApi.token = res.token;
    localStorage.setItem("token", res.token);
    return res.token;
  }

  static async login(credentials) {
    try {
      const res = await this.request("auth/login", credentials, "post");
      AhiskaApi.token = res.token;
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      return res;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  static async logout() {
    AhiskaApi.token = null;
    localStorage.removeItem("token");
  }

  /** USER ROUTES */
  static async getCurrentUser(userId) {
    return await this.request(`users/${userId}`);
  }
  static async getById(userId) {
    return await this.request(`user/${userId}`);
  }
  static async updateUser(userId, userData) {
    return await this.request(`users/${userId}`, userData, "patch");
  }
  static async changePassword(userId, newPassword) {
    const res = await this.request(
      `users/${userId}/password`,
      {
        newPassword,
      },
      "patch"
    );
    return res;
  }
  static async deleteUser(userId) {
    return await this.request(`users/${userId}`, {}, "delete");
  }

  /** EVENT ROUTES */
  static async getAllEvents() {
    return await this.request("events");
  }

  static async getEvent(eventId) {
    return await this.request(`events/${eventId}`);
  }

  static async createEvent(eventData) {
    return await this.request("events", eventData, "post");
  }

  static async updateEvent(eventId, updatedData) {
    return await this.request(`events/${eventId}`, updatedData, "patch");
  }

  static async deleteEvent(eventId) {
    return await this.request(`events/${eventId}`, {}, "delete");
  }

  /** EVENT REGISTRATION ROUTES */
  static async registerForEvent(eventId) {
    return await this.request(`events/${eventId}/register`, {}, "post");
  }

  static async unregisterFromEvent(eventId) {
    return await this.request(`events/${eventId}/register`, {}, "delete");
  }

  static async getEventRegistrations(eventId) {
    return await this.request(`events/${eventId}/register`);
  }

  static async getUserRegistrations(userId) {
    return await this.request(`users/${userId}`);
  }

  /** FEEDBACK ROUTES */
  static async getFeedback(eventId) {
    return await this.request(`events/${eventId}/feedback`);
  }

  static async addFeedback(eventId, feedbackData) {
    return await this.request(
      `events/${eventId}/feedback`,
      feedbackData,
      "post"
    );
  }

  static async deleteFeedback(feedbackId) {
    return await this.request(`feedback/${feedbackId}`, {}, "delete");
  }

  /** Q and A ROUTES */
  static async getAllQAndA() {
    return await this.request("q_and_a");
  }

  static async getQandAById(id) {
    return await this.request(`q_and_a/${id}`);
  }

  static async createQuestion(question) {
    return await this.request("q_and_a", { question }, "post");
  }

  static async answerQuestion(id, answer) {
    return await this.request(`q_and_a/${id}/answer`, { answer }, "patch");
  }

  static async deleteQuestion(id) {
    return await this.request(`q_and_a/${id}`, {}, "delete");
  }

  /** ADMIN ROUTES */
  static async getAllUsers() {
    return await this.request("admin/users");
  }

  static async getUser(username) {
    return await this.request(`admin/users/${username}`);
  }

  static async updateUserAdmin(username, updatedData) {
    return await this.request(`admin/users/${username}`, updatedData, "patch");
  }

  static async deleteUserAdmin(username) {
    return await this.request(`admin/users/${username}`, {}, "delete");
  }

  static async getAllEventsAdmin() {
    return await this.request("admin/events");
  }

  static async deleteEventAdmin(eventId) {
    return await this.request(`admin/events/${eventId}`, {}, "delete");
  }

  /** Search Users by Name or Email */
  static async searchUsers(query) {
    return await this.request("users/search", query);
  }

  /** Update User Role (Admin Only) */
  static async updatedUserRole(userId, role) {
    return await this.request(`admin/users/${userId}/role`, { role }, "patch");
  }
}

export default AhiskaApi;
