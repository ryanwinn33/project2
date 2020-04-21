import pandas as pd
import pymongo
import os
import csv_to_MDB
import json
from flask_cors import CORS
from flask import Flask, jsonify, Response, request, render_template

app = Flask(__name__)
CORS(app)
# cors = CORS(app, resources={
#     r"/*": {
#         "origins": "*"
#     }
# }

collection_year,collection_month = csv_to_MDB.init_db()

# results = collection_m.find()
# for item in results:
#     print(item)

# API routes
@app.route("/")
def home():
    return render_template("home.html")

@app.route("/api/disasters", methods=['GET'])
def all_disasters():
    disasters_year = collection_year.find()
    results = []
    for item in disasters_year:
        results.append({"Year" : item["Year"], "State":item["State"],
        "Type": item["Incident Type"], "Incident Count" : item["Count of Incidents"],
        "Total": item["Total Obligated"]})

    return jsonify({"Result" : results})

@app.route("/api/disastermonth", methods=['GET'])
def disasters_by_month():
    disasters_month = collection_month.find()
    results_month = []
    for item in disasters_month:
        results_month.append({"Year" : item["Year"], "Month": item["Month"], "State":item["State"],
        "Type": item["Incident Type"], "Incident Count" : item["Count of Incidents"],
        "Total":item["Total Obligated"]})

    return jsonify({"Result" : results_month})

@app.route("/api/disasteryear/<int:year>")
def disaster_by_year(year):
    try:
        results = collection_month.find({"Year":year})
        months_data = {}
        # if year in results["Year"]:
        for item in results:
            if item["Month"] not in months_data:
                months_data[item["Month"]] = [{"State":item["State"],
                "Type": item["Incident Type"], "Incident Count" : item["Count of Incidents"],
                "Total": item["Total Obligated"]}]
            elif item["Month"] in months_data:
                months_data[item["Month"]].append({"State":item["State"],
                "Type": item["Incident Type"], "Incident Count" : item["Count of Incidents"],
                "Total": item["Total Obligated"]})
            else:
                pass
        # else:
        #     raise Exception(f"Invalid year. {year} not found in our database.")

        return jsonify({year : months_data})
    except TypeError:
        return jsonify({"ERROR": "incorrect input type. 'Year' should be of the type 'integer'"})


@app.route("/api/disasterstate/<string:state>")
def state_disaster(state):
    try:
        if state != state.title():
            state = state.title()
        results_state = collection_year.find({"State":state})
        state_data = {}
        # if state in results_state:
        for item in results_state:
            if item["Year"] not in state_data:
                state_data[item["Year"]] = [{"Type": item["Incident Type"], "Incident Count" : item["Count of Incidents"],
                "Total": item["Total Obligated"]}]
            elif item["Year"] in state_data:
                state_data[item["Year"]].append({"Type": item["Incident Type"], "Incident Count" : item["Count of Incidents"],
                "Total": item["Total Obligated"]})
            else:
                pass
        # else:
        #     raise Exception(state + " not found in our database.")

        return jsonify({state : state_data})
    except TypeError:
        return jsonify({"ERROR": "incorrect input type. State should be of the type 'string'"})


# @app.route("/api/disasters/<string:disasterName>", methods=["POST"])
# def create_disaster(disasterName):
#     pass

if __name__ == '__main__':
    app.run(port=5000, debug=True)
