# -*- coding: utf-8 -*-
import xml.etree.ElementTree
import urllib.request
import json


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


c = open_url('https://data.cotrip.org/xml/speed_segments.xml', 'GoCo', 'dRAb3p')
data = {}
tree = xml.etree.ElementTree.parse(c)
date = ""
for segments in tree.findall('{http://www.cotrip.org/schema/speed}Segment'):
    for segment in segments.findall('.'):
        segmentId = int(segment.find('*').text)
        # if segmentId == 31:
        date = segment.find('{http://www.cotrip.org/schema/speed}CalculatedDate').text
        d1 = {"Conditions": {
            "AverageSpeed": float(segment.find('{http://www.cotrip.org/schema/speed}AverageSpeed').text),
            "AverageOccupancy": int(
                segment.find('{http://www.cotrip.org/schema/speed}AverageOccupancy').text),
            "AverageVolume": float(
                segment.find('{http://www.cotrip.org/schema/speed}AverageVolume').text),
            "AverageTrafficFlow": float(
                segment.find('{http://www.cotrip.org/schema/speed}AverageTrafficFlow').text),
            "IsSlowDown": bool(segment.find('{http://www.cotrip.org/schema/speed}IsSlowDown').text)}}
        data[segmentId] = d1

date = "".join([char if char != ':' else '_' for char in date])
with open(date + '.json', 'wt') as out:
    out.write(json.dumps(data))
    out.close()

json_data = json.dumps(data)
# f = database_put("https://incandescent-inferno-3953.firebaseio.com", "/exitnow1/speed_seg.json", 'application/json',
# data)
# print(f.read().decode('utf-8'))
print(json_data)