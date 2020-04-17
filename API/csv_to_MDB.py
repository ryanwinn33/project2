import pandas as pd
import pymongo
import json

def init_db():

    # app.config["MONGO_URI"] = 'mongodb://localhost:27017'
    # mongo = PyMongo
    conn = 'mongodb://localhost:27017'
    client = pymongo.MongoClient(conn)

    # Name of database
    disaster_db = client.disasterDB

    # collections
    collection_y = disaster_db.disasterByYear
    collection_m = disaster_db.disasterByMonth

    if __name__ == "__main__":

        #import clean data CSVs
        data_by_month = pd.read_csv("../Data/Disaster_cost_by_month.csv")
        data_by_year = pd.read_csv("../Data/Disaster_cost_by_year.csv")
        #obligated_totals = pd.read_csv("Data/Obligated_totals_by_state.csv")

        # Load csvs into databases
        data1 = data_by_month
        data1_json = json.loads(data1.to_json(orient='records'))
        collection_m.insert_many(data1_json)

        data2 = data_by_year
        data2_json = json.loads(data2.to_json(orient='records'))
        collection_y.insert_many(data2_json)

        results = collection_m.find()
        for item in results:
            print(item)

    else:
        print("CSV's already imported")
        return disaster_db
        # collection_y = disaster_db.disasterByYear
        # collection_m = disaster_db.disasterByMonth


init_db()
