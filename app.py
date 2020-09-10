from flask import Flask, render_template, request,  jsonify
from quandlHelper import QuandlHelper
import json

app = Flask(__name__)

# External Class for doing work
quandlHelper = QuandlHelper()

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/getStockTable/', methods=['POST'])
def getStockTable():
    content = request.json["data"]
    stock = content["stock"]
    
    df = quandlHelper.getStockTableData(stock)
    return jsonify(json.loads(df.to_json(orient="records")))

@app.route('/getStockPlot/', methods=['POST'])
def getStockPlot():
    content = request.json["data"]
    stock = content["stock"]

    rtnDict = quandlHelper.getStockPlotData(stock)
    return jsonify(rtnDict)

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=80)
