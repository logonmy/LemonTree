#coding:utf-8
import web
import sys
import httplib, urllib
import json
from OracleConnector import OracleConnector

ERR_URL_WITHTOUT_NECESSARY_ATTR = 1

reload(sys)
sys.setdefaultencoding('utf-8')

def HttpConnectionInit(host = '192.168.1.3', port = 8080):
    return httplib.HTTPConnection(host, port)

def HttpConnectionClose(connection):
    connection.close()

class ajax_ci:
    def GET(self):
        url = "/ci"
        token_init = 0
        result = web.input(citype_name = None, name=None, tag=None,  \
                           priority=None, owner=None, type_fid=None, \
                           family_id=None)
        conn  =  HttpConnectionInit()
        
        page_attr = {'citype_name' : result.citype_name,                #CI TYPE的名字
                     'name'        : result.name,                       #CI 名字
                     'tag'         : result.tag,                        #标签
                     'priority'    : result.priority,                   #优先级 
                     'owner'       : result.owner,                      #属主
                     'type_fid'    : result.type_fid,                   #CI TYPE的family id
                     'family_id'   : result.family_id,                  #CI的family id
                     }
        
        for key, value in page_attr.items() :
            if value :
                if token_init == 0:
                    url += "?" + key + "=" + value
                    tokent_init = 1
                else:
                    url += "&" + key + "=" + value
        
        conn.request(method = "GET",url = url)
        data = conn.getresponse().read()
        HttpConnectionClose(conn)
        return data

    def POST(self):
        result = web.input(description=None, tag=None, priority=0, owner=None)
        page_attr = {'name'         : result.ciname,
                     'ci_type_fid'  : result.ci_type_fid,
                     'description'  : result.description,
                     'tag'          : result.tag,
                     'priority'     : result.priority,
                     'owner'        : result.owner,
                     }
         
        conn  =  HttpConnectionInit()
        if page_attr['name'] is None or page_attr['ci_type_fid'] is None:
            return ERR_URL_WITHTOUT_NECESSARY_ATTR
         
        for key, value in page_attr.items():
            if value is None:
                del page_attr[key]
         
        params = urllib.urlencode(page_attr)
        conn.request("POST", "/ci", params)
        response = conn.getresponse()
        result = response.read()
        HttpConnectionClose(conn)
        return result

class ajax_cirela:
    def GET(self):
        pass
    
    def POST(self):
        result = web.input(owner = None)
        conn  =  HttpConnectionInit()
        page_attr = {'source_fid' : result.source_fid,                #CI family_id
                     'target_fid' : result.target_fid,                #CI family_id
                     'relation'   : result.relation,                  #CI relation name
                     'owner'      : result.owner,                     #属主 
                     }
            
        if page_attr['source_fid'] is None or page_attr['target_fid'] is None  \
            or page_attr['relation'] is None:
            return ERR_URL_WITHTOUT_NECESSARY_ATTR
        
        for key, value in page_attr.items():
            if value is None:
                del page_attr[key]
         
        params = urllib.urlencode(page_attr)
        conn.request("POST", "/cirela", params)
        response = conn.getresponse()
        result = response.read()
        HttpConnectionClose(conn)
        return result
    
class ajax_ciattr:
    def GET(self):
        url = "/ciattr"
        token_init = 0
        result = web.input(citype_name = None, ciat_name=None, ci_name=None,  \
                           type_fid=None, owner=None, ci_fid=None, \
                           family_id=None, time=None)
        conn  =  HttpConnectionInit()
        
        page_attr = {'citype_name' : result.citype_name,
                     'ciat_name'   : result.ciat_name,
                     'ci_name'     : result.ci_name,
                     'type_fid'    : result.type_fid, 
                     'owner'       : result.owner,
                     'ci_fid'      : result.ci_fid,
                     'family_id'   : result.family_id,
                     'time'        : result.time,
                     }
        
        for key, value in page_attr.items() :
            if value :
                if token_init == 0:
                    url += "?" + key + "=" + value
                    tokent_init = 1
                else:
                    url += "&" + key + "=" + value
        
        conn.request(method = "GET",url = url)
        data = conn.getresponse().read()
        HttpConnectionClose(conn)
        return data

    def POST(self):
        pass
    
class ajax_get_citype:
    def GET(self):
        url = "/citype"
        result = web.input(name = None)
        conn  =  HttpConnectionInit()
        
        if result.name :
            url += "?name=" + result.name
        
        conn.request(method = "GET",url = url)
        data = conn.getresponse().read()
        HttpConnectionClose(conn)
        return data

class ajax_get_ci_all_attr:
    def GET(self):
        url_ciattr = "/ciattr"
        token_init = 0
        result = web.input(cifid = None, ci_type_fid = None)
        conn  =  HttpConnectionInit()
        
        if result.cifid :
            if token_init == 0:
                url_ciattr += "?ci_fid=" + result.cifid
                token_init = 1
            else:
                url_ciattr += "&ci_fid=" + result.cifid
        
        conn.request(method = "GET",url = url_ciattr)
        data = conn.getresponse().read()
        HttpConnectionClose(conn)
        return data

class ajax_get_citype_all_attr:
    def GET(self):
        url_citypeattr = "/ciattrtype"
        token_init = 0
        result = web.input(ci_type_fid = None)
        conn  =  HttpConnectionInit()
        
        if result.ci_type_fid :
            if token_init == 0:
                url_citypeattr += "?ci_type_fid=" + result.ci_type_fid
                token_init = 1
            else:
                url_citypeattr += "&ci_type_fid=" + result.ci_type_fid
        
        conn.request(method = "GET",url = url_citypeattr)
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
        
class ajax_get_baseline_osuser:
    def GET(self):
        conn = HttpConnectionInit()
        url = "/ci?citype_name=OS_USER&tag=BASELINE:OS_RHEL6.3_X64"
        conn.request(method = "GET",url = url)
        formatdata = json.loads(conn.getresponse().read())
        
        return json.dumps(formatdata, indent = 4,ensure_ascii=False, separators = (',',':'))
    
class ajax_get_baseline_list:
    def GET(self):
        formatdata = []
        db = web.database(dbn='oracle', user='host', pw='host123', db='cffexcmdb')
        sql = '''select id, type, displayname, description from t_baseline'''
        baseline_list = db.query(sql)
        for item in baseline_list:
            formatdata.append(item)
        formatdata = json.dumps(formatdata, indent = 4,ensure_ascii=False, separators = (',',':'))

        return formatdata
        
class ajax_post_attr:
    '''
                    页面传入的参数为：
                            必输入项：cifid， ciattr_type_fid，value
                            可选输入项：description， owner
    '''
    def POST(self):
        url_params = web.input(description=None, owner=None)
        cifid = url_params.get('cifid')
        ciattr_type_fid = url_params.get('ciattr_type_fid')
        ciattr_value = url_params.get('value')
        
        conn  =  HttpConnectionInit()
        if cifid is None or ciattr_type_fid is None or ciattr_value is None:
            return ERR_URL_WITHTOUT_NECESSARY_ATTR
        
        params = {'ci_fid': cifid, 'ci_attrtype_fid': ciattr_type_fid,
                  'value' : ciattr_value}
            
        if url_params.description is not None:
            params['description'] = url_params.description
        
        if url_params.owner is not None:
            params['owner'] = url_params.owner
        
        params = urllib.urlencode(params)
        conn.request("POST", "/ciattr", params)
        response = conn.getresponse()
        result = response.read()
        HttpConnectionClose(conn)
        print response.status
        return result
 