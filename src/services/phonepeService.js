const BASE_URL = "https://raw.githubusercontent.com/PhonePe/pulse/master/data";

export const fetchTransactionData = async (year = 2023, quarter = 4) => {
  try {
    // Fetch aggregated transaction data for India
    const response = await fetch(
      `${BASE_URL}/aggregated/transaction/country/india/${year}/${quarter}.json`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch PhonePe data");
    }

    const data = await response.json();

    // Fetch state-wise data
    const stateResponse = await fetch(
      `${BASE_URL}/map/transaction/hover/country/india/${year}/${quarter}.json`
    );

    if (!stateResponse.ok) {
      throw new Error("Failed to fetch state data");
    }

    const stateData = await stateResponse.json();

    return {
      success: true,
      data: {
        hoverDataList: stateData.data.hoverDataList.map((state) => ({
          name: state.name.toLowerCase().replace(/\s+/g, "-"),
          metric: [
            {
              type: "TOTAL",
              count: state.metric[0].count,
              amount: state.metric[0].amount,
            },
          ],
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    throw error;
  }
};
