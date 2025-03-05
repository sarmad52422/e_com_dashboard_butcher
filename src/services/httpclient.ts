import axios from "axios";

export class HttpClient {
  static baseUrl: String = "http://localhost:5001";
  // static baseUrl:String = "https://e-com-backend-1zsb.onrender.com";

  static async post(url: string, data: any) {
    try {
      console.log(this.baseUrl + url);
      console.log(`Data = ${JSON.stringify(data)}`);
      const response = await axios.post(this.baseUrl + url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.status === 200) {
        return { data: response.data };
      } else {
        return { error: response?.data?.error };
      }
    } catch (e) {
      return { error: e };
    }
  }
  static async get(url: string) {
    try {
      const response = await axios.get(this.baseUrl + url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.status === 200) {
        return { data: response.data };
      } else {
        return { error: response?.data?.error };
      }
    } catch (e) {
      return { error: e };
    }
  }
  static async delete(url: string) {
    try {
      const response = await axios.delete(this.baseUrl + url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.status === 200) {
        return { data: response.data };
      } else {
        return { error: response?.data?.error };
      }
    } catch (e) {
      return { error: e };
    }
  }
  static async patch(url: string, data: any) {
    try {
      const response = await axios.patch(this.baseUrl + url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(this.baseUrl, url);

      if (response?.status === 200) {
        return { data: response.data };
      } else {
        return { error: response?.data?.error };
      }
    } catch (e) {
      return { error: e };
    }
  }
}
