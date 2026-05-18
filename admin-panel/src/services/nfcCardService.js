import api from "./api";

const nfcCardService = {
  async getAllCards() {
    const response = await api.get("/nfc-cards");
    return response.data;
  },

  async createCard(card_uid) {
    const response = await api.post("/nfc-cards", { card_uid, status: "unassigned" });
    return response.data;
  },

  async assignCard(id, user_id, profile_id) {
    const response = await api.put(`/nfc-cards/${id}/assign`, { user_id, profile_id });
    return response.data;
  },

  async lockCard(id) {
    const response = await api.put(`/nfc-cards/${id}/lock`);
    return response.data;
  },

  async unlockCard(id) {
    const response = await api.put(`/nfc-cards/${id}/unlock`);
    return response.data;
  },

  async deleteCard(id) {
    const response = await api.delete(`/nfc-cards/${id}`);
    return response.data;
  },
};

export default nfcCardService;
