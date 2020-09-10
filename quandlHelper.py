import requests
import pandas as pd
import json

class QuandlHelper():
    def __init__(self):
        self.apiKey = "Q5PzuLTvVYuHsJCBoE_L"

    # Get Stock data for the table
    def getStockTableData(self, stock):
        url = f"https://www.quandl.com/api/v3/datasets/WIKI/{stock}.json?start_date=2016-10-01&end_date=2017-10-01&collapse=monthly&api_key={self.apiKey}"

        response = requests.get(url)
        data = response.json()
        dataForTable = data["dataset"]["data"]
        df = pd.DataFrame(dataForTable, columns=data["dataset"]["column_names"])
        return df

    # Get stock data for the plot
    def getStockPlotData(self, stock):
        apiKey = "Q5PzuLTvVYuHsJCBoE_L"
        url = f"https://www.quandl.com/api/v3/datasets/WIKI/{stock}.json?start_date=2017-01-01&end_date=2018-11-22&api_key={self.apiKey}"

        response = requests.get(url)
        data = response.json()

        dataForTable = data["dataset"]["data"]
        df = pd.DataFrame(dataForTable, columns=data["dataset"]["column_names"])

        name = data["dataset"]["name"]
        description = data["dataset"]["description"]
        stock = data["dataset"]["dataset_code"]
        startDate = data["dataset"]["start_date"]
        endDate = data["dataset"]["end_date"]

        meta = {
            "name": name,
            "description": description,
            "stock": stock,
            "startDate": startDate,
            "endDate": endDate
        }

        rtnDict = {
            "meta": meta,
            "plot": json.loads(df.to_json(orient="records"))
        }

        return rtnDict