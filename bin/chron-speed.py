#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import xml.etree.ElementTree
import urllib.request
import json
from pymongo import MongoClient
import dateutil.parser


def open_url(url, username, password):
    password_man = urllib.request.HTTPPasswordMgrWithDefaultRealm()
    password_man.add_password(None, url, username, password)
    auth_handler = urllib.request.HTTPBasicAuthHandler(password_man)
    opener = urllib.request.build_opener(auth_handler)
    urllib.request.install_opener(opener)
    return urllib.request.urlopen(url)


def database_put(db_url, table, content_type, data_put):
    data_json = json.dumps(data_put).encode('utf-8')
    request = urllib.request.Request(db_url + table,
                                     data_json,
                                     {'Content-Type': content_type, 'Content-Length': len(data_json)})
    request.get_method = lambda: 'PUT'
    return urllib.request.urlopen(request)

client = MongoClient('mongodb://sa:en@ds061621.mongolab.com:61621/heroku_app35782065')
db = client.get_default_database()
states = db.states
c = open_url('https://data.cotrip.org/xml/speed_segments.xml', 'GoCo', 'dRAb3p')
data = []
tree = xml.etree.ElementTree.parse(c)
for segments in tree.findall('{http://www.cotrip.org/schema/speed}Segment'):
    for segment in segments.findall('.'):
        segmentId = int(segment.find('*').text)
        d1 = {'AverageSpeed': float(segment.find('{http://www.cotrip.org/schema/speed}AverageSpeed').text),
              'AverageTrafficFlow': float(segment.find('{http://www.cotrip.org/schema/speed}AverageTrafficFlow').text),
              'IsSlowDown': bool(segment.find('{http://www.cotrip.org/schema/speed}IsSlowDown').text),
              'RoadCondition': int(8),
              'ExpectedTravelTime': int(0),
              'TravelTime': int(0),
              'AverageOccupancy': int(segment.find('{http://www.cotrip.org/schema/speed}AverageOccupancy').text),
              'AverageVolume': float(segment.find('{http://www.cotrip.org/schema/speed}AverageVolume').text)}
        post = {'CalculatedDate': dateutil.parser.parse(segment.find('{http://www.cotrip.org/schema/speed}CalculatedDate').text),
                'SegmentId': int(segment.find('{http://www.cotrip.org/schema/speed}SegmentId').text),
                'Conditions': d1}
        data.append(post)


results = states.insert_many(data)
# with open(date + '.json', 'wt') as out:
#     out.write(json.dumps(data))
#     out.close()

# json_data = json.dumps(data)
# f = database_put("https://incandescent-inferno-3953.firebaseio.com", "/exitnow1/speed_seg.json", 'application/json',
# data)
# print(f.read().decode('utf-8'))
# print(json_data)

