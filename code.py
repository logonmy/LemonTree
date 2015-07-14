#coding:utf-8
import web
import sys
import httplib, urllib
import json

urls = (
        '/index'            ,'index',
        '/hostinfo'         ,'hostinfo',
        '/hostlist'         ,'hostlist',
        '/hostbaselinelist' ,'hostbaselinelist',
        '/addhost'          ,'addhost',
        '/ajax_gethostlist' ,'ajax_gethostlist',
        '/ajax_getci'       ,'ajax_getci',
       )

def HttpConnectionInit(host = '192.168.1.3', port = 8080):
    return httplib.HTTPConnection(host, port)

def HttpConnectionClose(connection):
    connection.close()

class index:
    def GET(self):
        name = None
        render = web.template.render('templates/', base='layout')
        return render.index(name)
     
    def POST(self):
        pass
        
class hostinfo:
    def GET(self):
        server = web.input(host = "slave1")     #页面url中传入的参数：主机名
        render = web.template.render('templates/host/', base='layout_info')
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
    
class hostlist:
    def GET(self):
        render = web.template.render('templates/host/', base='layout')
        return render.hostlist()
        
    def POST(self):
        pass

class hostbaselinelist:
    def GET(self):
        render = web.template.render('templates/host/', base='layout')
        return render.hostbaselinelist()
    
    def POST(self):
        pass
    
class addhost:
    def GET(self):
        render = web.template.render('templates/host/', base='layout_info')
        return render.addhost()

class ajax_getci:
    def GET(self):
        result = web.input(cifid = None)
        conn  =  HttpConnectionInit()
        url_citype = "/ciattr?ci_fid=" + result.cifid
        conn.request(method = "GET",url = url_citype)
        data = conn.getresponse().read()
        HttpConnectionClose(conn)
        return data
    
class ajax_gethostlist:
    def GET(self):
        conn  =  HttpConnectionInit()
        #返回主机所有CI TYPE
        url_citype = "/ci?citype_name=HOST_OS"
        conn.request(method = "GET",url = url_citype)
        formatdata = json.loads(conn.getresponse().read())
        
        list_host = []                      #OS列表，保存所有主机
        #获取所有主机列表，每个OS信息对应一个字典
        for ci in formatdata:
            temp_dict = {}
            if ci["DESCRIPTION"] is None:
                temp_dict["DESCRIPTION"] = ""
            else:
                temp_dict["DESCRIPTION"] = ci["DESCRIPTION"].encode('utf-8')
            
            cifid = ci["FAMILY_ID"].encode('utf-8')
            url_ciattr = "/ciattr?ci_fid=" + cifid
            conn.request(method="GET", url = url_ciattr)
            data_ciattr = json.loads(conn.getresponse().read())
            #遍历OS的所有属性，将所有属性保存为key-value形式
            for eachattr in data_ciattr:
                temp_dict[eachattr["CIAT_NAME"].encode('utf-8')] = eachattr["VALUE"].encode('utf-8')
                
            list_host.append(temp_dict)
        
        HttpConnectionClose(conn)    
        return json.dumps(list_host, indent = 4,ensure_ascii=False, separators = (',',':'))
        
 
if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
