import pymongo
import time
import os,sys


def drop_collections():


    conn = 'mongodb://localhost:27017'
    client = pymongo.MongoClient(conn)

    # Name of database
    db = client.disastersDB

    collection_year = db.disasterByYear
    collection_month = db.disasterByMonth

    db.collection_m.drop()
    db.collection_y.drop()

user_input = input("Are you sure you want to drop these tables/collections (y/n)?")
if user_input.lower() == 'y' or user_input.lower() == 'yes':
    drop_collections()
    print("Testing to see if collection still exists. Test should not find the tables...")
    time.sleep(3)
    results = collection_m.find()
    for item in results:
        print(item)

else:
    print("Okay, we will NOT drop the collections")
    sys.exit()
