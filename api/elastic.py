from flask import Flask, jsonify

from elasticsearch import Elasticsearch

# start elasticsearch

es = Elasticsearch()


# end elasticsearch

def getAll():
    results = es.get(index='index_contents', doc_type="content", id=5)
    return jsonify(results['_source'])


def insertData(id, title, content):
    body = {
        "title": title,
        "content": content
    }
    result = es.index(index='index_contents', id=id, doc_type='content', body=body)
    return jsonify(result)

def searchScroll(keyword, page, page_size):
    body = {
        "from": page * page_size,
        "size":10,
        "query": {
            # "match_all" : {}
            "multi_match": {
                "query": keyword,
                "fields": ["content", "title"]
            }
        }
    }
    res = es.search(index='index_contents', doc_type='content', body=body)
    # dev
    # total = res['hits']['total']
    # server:
    total = res['hits']['total']['value']
    temp = {
        "total": total,
        "hasNext": False,
        "arr": []
    }
    if(total > (page + 1) * page_size):
        temp['hasNext'] = True
    if (len(res['hits']['hits']) != 0):
        i = 0
        while i < len(res['hits']['hits']):
            temp["arr"].append(res['hits']['hits'][i]["_source"])
            i += 1
    #new version
    return temp


def deleteId(id):
    index = "index_contents"
    doc_type = 'content'
    es.delete(index=index, doc_type=doc_type, id=id)
    return "done"


def deleteEntireIndex():
    index = "index_contents"
    es.indices.delete(index)
    return "done"
