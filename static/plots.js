//run on page load
$(document).ready(function() {
    var stockInput = "AMZN"; // default
    buildPlot(stockInput);
    getMonthlyData(stockInput);

    // Add event listener for submit button
    $("#submit").on("click", function(event) {
        // Prevent the page from refreshing
        event.preventDefault();
        handleSubmit();
    });
});

// gets data for the table
function getMonthlyData(stockInput) {
    var payload = {
        "stock": stockInput
    };

    $.ajax({
        type: 'POST',
        url: "/getStockTable/",
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ "data": payload }),
        success: function(data) {
            //alert("YAY Post request Worked");
            //console.log(data);

            let dates = data.map(x => x["Date"]);
            let openPrices = data.map(x => x["Open"]);
            let highPrices = data.map(x => x["High"]);
            let lowPrices = data.map(x => x["Low"]);
            let closingPrices = data.map(x => x["Close"]);
            let volume = data.map(x => x["Volume"]);

            buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);
        }
    });
}

function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
    $("#summary-table tbody").html(""); //reload table    
    for (var i = 0; i < 12; i++) {
        let row = "<tr>";
        row += `<td>${dates[i]}</td>`;
        row += `<td>${openPrices[i]}</td>`;
        row += `<td>${highPrices[i]}</td>`;
        row += `<td>${lowPrices[i]}</td>`;
        row += `<td>${closingPrices[i]}</td>`;
        row += `<td>${volume[i]}</td>`;
        row += "</tr>";
        $("#summary-table tbody").append(row);
    }
}

// gets data for the plot
function buildPlot(stockInput) {
    var payload = {
        "stock": stockInput
    };

    $.ajax({
        type: 'POST',
        url: "/getStockPlot/",
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ "data": payload }),
        success: function(data) {

            let name = data.meta.name;
            let description = data.meta.description;
            let stock = data.meta.dataset_code;
            let startDate = data.meta.startDate;
            let endDate = data.meta.endDate;

            $("#report-title").text(name);
            $("#company").html(description);

            let dates = data.plot.map(x => x["Date"]);
            let openPrices = data.plot.map(x => x["Open"]);
            let highPrices = data.plot.map(x => x["High"]);
            let lowPrices = data.plot.map(x => x["Low"]);
            let closingPrices = data.plot.map(x => x["Close"]);
            let volume = data.plot.map(x => x["Volume"]);

            // Closing Scatter Line Trace
            var trace1 = {
                type: "scatter",
                mode: "lines",
                name: name,
                x: dates,
                y: closingPrices,
                line: {
                    color: "#17BECF"
                }
            };

            // Candlestick Trace
            var trace2 = {
                // @TODO: YOUR CODE HERE
                x: dates,
                close: closingPrices,
                decreasing: { line: { color: '#7F7F7F' } },
                high: highPrices,
                increasing: { line: { color: '#17BECF' } },
                line: { color: 'rgba(31,119,180,1)' },
                low: lowPrices,
                open: openPrices,
                type: 'candlestick',
                xaxis: 'x',
                yaxis: 'y'
            };

            var data = [trace1, trace2];

            var layout = {
                title: `${stockInput} closing prices`,
                xaxis: {
                    range: [startDate, endDate],
                    type: "date"
                },
                yaxis: {
                    autorange: true,
                    type: "linear"
                },
                showlegend: false
            };

            Plotly.newPlot("plot", data, layout);
        }
    });
}

// Submit Button handler
function handleSubmit() {
    // Select the input value from the form
    var stock = $("#stockInput").val();

    // clear the input value
    $("#stockInput").val("");
    $("#stockInput").text("");

    // Build the plot with the new stock
    buildPlot(stock);
    getMonthlyData(stockInput);
}