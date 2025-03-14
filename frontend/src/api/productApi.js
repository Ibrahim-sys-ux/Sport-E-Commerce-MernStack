import axios from "axios";

export const getFeaturedProducts = async () => {
  try {
    const response = await axios.get("/api/products/featured");
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};
