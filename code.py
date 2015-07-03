#coding:utf-8
import web
import sys
import httplib, urllib
import json

urls = (
        '/index', 'index',
        '/hostinfo', 'hostinfo',
        '/getci', 'ajax_getci'
       )

def HttpConnectionInit(host = '192.168.1.3', port = 8080):
    return httplib.HTTPConnection(host, port)

def HttpConnectionClose(connection):
    connection.close()

class index:
    def GET(self):
        name = None
        render = web.template.render('templates/', base='layout')
        #a = web.input(name = None)
        return render.index(name)
     
    def POST(self):
        pass
        
class hostinfo:
    def GET(self):
        server = web.input(host = "slave1")     #页面url中传入的参数：主机名
        render = web.template.render('templates/', base='layout_info')
        if server is None:
            return render.hostinfo()
        
        conn  =  HttpConnectionInit()
        #返回主机所有CI TYPE
        url_citype = "/citype?owner=OS"
        conn.request(method = "GET",url = url_citype)
        data_citype = json.loads(conn.getresponse().read())

        list_citype = []
        for citype in data_citype:
            temp_dict = {}
            for key,value in citype.items():
                o_key = key.encode('utf-8')
                if not value:
                    o_value = ""
                else:
                    o_value = value.encode('utf-8') 
                temp_dict[o_key] = o_value
                
            list_citype.append(temp_dict)

        #返回对应主机名下的所有CI
        url_ci = "/cirela?sourcename=" + server.host
        conn.request(method = "GET",url = url_ci)
        data_ci = json.loads(conn.getresponse().read())
        
        dict_ci = {}
        for ci in data_ci:
            temp_cidict = {}
            if ci["TARGET_TYPE_FID"].encode('utf-8') not in dict_ci:
                dict_ci[ci["TARGET_TYPE_FID"].encode('utf-8')] = []
            for key,value in ci.items():
                o_key = key.encode('utf-8')
                if not value:
                    o_value = ""
                else:
                    o_value = value.encode('utf-8')
                temp_cidict[o_key] = o_value
            dict_ci[ci["TARGET_TYPE_FID"].encode('utf-8')].append(temp_cidict)

        HttpConnectionClose(conn)
        return render.hostinfo(list_citype, dict_ci, host = server.host)

    def POST(self):
        pass
    
class ajax_getci:
    def GET(self):
        result = web.input(cifid = None)
        conn  =  HttpConnectionInit()
        url_citype = "/ciattr?ci_fid=" + result.cifid
        conn.request(method = "GET",url = url_citype)
        data = conn.getresponse().read()
        HttpConnectionClose(conn)
        return data
 
if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
