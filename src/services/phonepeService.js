const BASE_URL = "https://api.phonepe.com/pulse/v1"; // Replace with actual API URL

export const fetchTransactionData = async (year = 2024, quarter = 1) => {
  try {
    // Mock data matching PhonePe's actual transaction patterns
    return {
      success: true,
      data: {
        hoverDataList: [
          {
            name: "maharashtra",
            metric: [
              {
                type: "TOTAL",
                count: 35802467,
                amount: 6913569020000,
              },
            ],
          },
          {
            name: "andhra-pradesh",
            metric: [
              {
                type: "TOTAL",
                count: 28456789,
                amount: 4567890123456,
              },
            ],
          },
          {
            name: "arunachal-pradesh",
            metric: [
              {
                type: "TOTAL",
                count: 1234567,
                amount: 234567890123,
              },
            ],
          },
          {
            name: "assam",
            metric: [
              {
                type: "TOTAL",
                count: 15678901,
                amount: 2345678901234,
              },
            ],
          },
          {
            name: "bihar",
            metric: [
              {
                type: "TOTAL",
                count: 25678901,
                amount: 3456789012345,
              },
            ],
          },
          {
            name: "chhattisgarh",
            metric: [
              {
                type: "TOTAL",
                count: 18901234,
                amount: 2789012345678,
              },
            ],
          },
          {
            name: "goa",
            metric: [
              {
                type: "TOTAL",
                count: 5678901,
                amount: 890123456789,
              },
            ],
          },
          {
            name: "gujarat",
            metric: [
              {
                type: "TOTAL",
                count: 32456789,
                amount: 5678901234567,
              },
            ],
          },
          {
            name: "haryana",
            metric: [
              {
                type: "TOTAL",
                count: 24567890,
                amount: 3901234567890,
              },
            ],
          },
          {
            name: "himachal-pradesh",
            metric: [
              {
                type: "TOTAL",
                count: 8901234,
                amount: 1234567890123,
              },
            ],
          },
          {
            name: "jharkhand",
            metric: [
              {
                type: "TOTAL",
                count: 16789012,
                amount: 2567890123456,
              },
            ],
          },
          {
            name: "karnataka",
            metric: [
              {
                type: "TOTAL",
                count: 34567890,
                amount: 6234567890123,
              },
            ],
          },
          {
            name: "kerala",
            metric: [
              {
                type: "TOTAL",
                count: 28901234,
                amount: 4567890123456,
              },
            ],
          },
          {
            name: "madhya-pradesh",
            metric: [
              {
                type: "TOTAL",
                count: 27890123,
                amount: 4123456789012,
              },
            ],
          },
          {
            name: "manipur",
            metric: [
              {
                type: "TOTAL",
                count: 2345678,
                amount: 345678901234,
              },
            ],
          },
          {
            name: "meghalaya",
            metric: [
              {
                type: "TOTAL",
                count: 1890123,
                amount: 234567890123,
              },
            ],
          },
          {
            name: "mizoram",
            metric: [
              {
                type: "TOTAL",
                count: 1234567,
                amount: 123456789012,
              },
            ],
          },
          {
            name: "nagaland",
            metric: [
              {
                type: "TOTAL",
                count: 1567890,
                amount: 234567890123,
              },
            ],
          },
          {
            name: "odisha",
            metric: [
              {
                type: "TOTAL",
                count: 19012345,
                amount: 2890123456789,
              },
            ],
          },
          {
            name: "punjab",
            metric: [
              {
                type: "TOTAL",
                count: 23456789,
                amount: 3567890123456,
              },
            ],
          },
          {
            name: "rajasthan",
            metric: [
              {
                type: "TOTAL",
                count: 29012345,
                amount: 4567890123456,
              },
            ],
          },
          {
            name: "sikkim",
            metric: [
              {
                type: "TOTAL",
                count: 1234567,
                amount: 123456789012,
              },
            ],
          },
          {
            name: "tamil-nadu",
            metric: [
              {
                type: "TOTAL",
                count: 33456789,
                amount: 5890123456789,
              },
            ],
          },
          {
            name: "telangana",
            metric: [
              {
                type: "TOTAL",
                count: 31234567,
                amount: 5234567890123,
              },
            ],
          },
          {
            name: "tripura",
            metric: [
              {
                type: "TOTAL",
                count: 2345678,
                amount: 345678901234,
              },
            ],
          },
          {
            name: "uttarakhand",
            metric: [
              {
                type: "TOTAL",
                count: 8901234,
                amount: 1234567890123,
              },
            ],
          },
          {
            name: "uttar-pradesh",
            metric: [
              {
                type: "TOTAL",
                count: 38901234,
                amount: 6789012345678,
              },
            ],
          },
          {
            name: "west-bengal",
            metric: [
              {
                type: "TOTAL",
                count: 29012345,
                amount: 4567890123456,
              },
            ],
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    throw error;
  }
};
