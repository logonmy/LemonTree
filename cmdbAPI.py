#coding:utf-8
import web
import sys
import httplib, urllib
import json
from OracleConnector import OracleConnector
import code

ERR_URL_WITHTOUT_NECESSARY_ATTR = 1

reload(sys)
#sys.setdefaultencoding('utf-8')


class ajax_ci:
    def GET(self):
        url = "/ci"
        token_init = 0
        result = web.input(citype_name = None, name=None, tag=None,  \
                           priority=None, owner=None, type_fid=None, \
                           family_id=None)
        
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
        
        conn = code.HttpConnectionInit()
        conn.request(method = "GET",url = url)
        data = conn.getresponse().read()
        code.HttpConnectionClose(conn)
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
        
        if page_attr['name'] is None or page_attr['ci_type_fid'] is None:
            return ERR_URL_WITHTOUT_NECESSARY_ATTR
         
        for key, value in page_attr.items():
            if value is None:
                del page_attr[key]
         
        params = urllib.urlencode(page_attr)
        conn = code.HttpConnectionInit()
        conn.request("POST", "/ci", params)
        response = conn.getresponse()
        result = response.read()
        
        code.HttpConnectionClose(conn)
        return result

class ajax_cirela:
    def GET(self):
        pass
    
    def POST(self):
        result = web.input(owner = None)
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
        conn = code.HttpConnectionInit()
        conn.request("POST", "/cirela", params)
        response = conn.getresponse()
        result = response.read()
        
        code.HttpConnectionClose(conn)
        return result
    
class ajax_ciattr:
    def GET(self):
        url = "/ciattr"
        token_init = 0
        result = web.input(citype_name = None, ciat_name=None, ci_name=None,  \
                           type_fid=None, owner=None, ci_fid=None, \
                           family_id=None, time=None)
        
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
        conn = code.HttpConnectionInit()
        conn.request(method = "GET",url = url)
        data = conn.getresponse().read()
        
        code.HttpConnectionClose(conn)
        return data

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
        
        if cifid is None or ciattr_type_fid is None or ciattr_value is None:
            return ERR_URL_WITHTOUT_NECESSARY_ATTR
        
        params = {'ci_fid': cifid, 'ci_attrtype_fid': ciattr_type_fid,
                  'value' : ciattr_value}
            
        if url_params.description is not None:
            params['description'] = url_params.description
        
        if url_params.owner is not None:
            params['owner'] = url_params.owner
        
        params = urllib.urlencode(params)
        conn = code.HttpConnectionInit()
        conn.request("POST", "/ciattr", params)
        response = conn.getresponse()
        result = response.read()
        
        code.HttpConnectionClose(conn)
        return result
    
class ajax_citype:
    def GET(self):
        url = "/citype"
        token_init = 0
        result = web.input(name = None, description=None, owner=None, \
                           family_id=None, time=None)
        
        page_attr = {'name'         : result.name,                   #CI TYPE的名字
                     'description'  : result.description,
                     'owner'        : result.owner,
                     'family_id'    : result.family_id,              #CI TYPE FAMILY_ID 
                     'time'         : result.time,
                     }
        
        for key, value in page_attr.items() :
            if value :
                if token_init == 0:
                    url += "?" + key + "=" + value
                    tokent_init = 1
                else:
                    url += "&" + key + "=" + value
        conn = code.HttpConnectionInit()
        conn.request(method = "GET",url = url)
        data = conn.getresponse().read()
        
        code.HttpConnectionClose(conn)
        return data

    def POST(self):
        pass
    
class ajax_cirelatype:
    def GET(self):
        pass
    
    def POST(self):
        pass
    
class ajax_ciattrtype:
    def GET(self):
        pass
    
    def POST(self):
        pass

class ajax_get_citype_all_attr:
    def GET(self):
        url_citypeattr = "/ciattrtype"
        token_init = 0
        result = web.input(ci_type_fid = None)
        
        if result.ci_type_fid :
            if token_init == 0:
                url_citypeattr += "?ci_type_fid=" + result.ci_type_fid
                token_init = 1
            else:
                url_citypeattr += "&ci_type_fid=" + result.ci_type_fid
        conn = code.HttpConnectionInit()
        conn.request(method = "GET",url = url_citypeattr)
        data = conn.getresponse().read()
        
        code.HttpConnectionClose(conn)
        return data

'''
gethostlist类不仅仅是获取了ci，而且还要显示一些属性，所以，这个是两个api合并后的结果
不能直接ajax_ci，单独提出来作为一个类，相应hostlist页面
'''    
class ajax_get_hostlist:
    def GET(self):
        #返回主机所有CI TYPE
        url_citype = "/ci?citype_name=HOST_OS"
        conn = code.HttpConnectionInit()
        conn.request(method = "GET",url = url_citype)
        formatdata = json.loads(conn.getresponse().read())
        
        list_host = []                      #OS列表，保存所有主机
        #获取所有主机列表，每个OS信息对应一个字典
        for ci in formatdata:
            temp_dict= {}
            temp_dict["NAME"] = ci["NAME"]
            temp_dict["DESCRIPTION"] = ci["DESCRIPTION"]

            url_ciattr = "/ciattr?ci_fid=" + ci["FAMILY_ID"]
            conn.request(method="GET", url = url_ciattr)
            data_ciattr = json.loads(conn.getresponse().read())
            #遍历OS的所有属性，将所有属性保存为key-value形式
            for eachattr in data_ciattr:
                temp_dict[eachattr["CIAT_NAME"]] = eachattr["VALUE"]
                
            list_host.append(temp_dict)
        
        code.HttpConnectionClose(conn)
        return json.dumps(list_host, indent = 4,ensure_ascii=False, separators = (',',':'))
        
class ajax_get_baseline_osuser:
    def GET(self):
        url = "/ci?citype_name=OS_USER&tag=BASELINE:OS_RHEL6.3_X64"
        conn = code.HttpConnectionInit()
        conn.request(method = "GET",url = url)
        formatdata = json.loads(conn.getresponse().read())
        
        code.HttpConnectionClose(conn)
        return json.dumps(formatdata, indent = 4,ensure_ascii=False, separators = (',',':'))
    
class ajax_get_baseline_list:
    def GET(self):
        formatdata = []
        db = web.database(dbn='oracle', user='host', pw='host123', db='cffexcmdb')
        sql = 'select id, type, displayname, description from t_baseline'
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
        if cifid is None or ciattr_type_fid is None or ciattr_value is None:
            return ERR_URL_WITHTOUT_NECESSARY_ATTR
        
        params = {'ci_fid': cifid, 'ci_attrtype_fid': ciattr_type_fid,
                  'value' : ciattr_value}
            
        if url_params.description is not None:
            params['description'] = url_params.description
        
        if url_params.owner is not None:
            params['owner'] = url_params.owner
        
        params = urllib.urlencode(params)
        conn = code.HttpConnectionInit()
        conn.request("POST", "/ciattr", params)
        response = conn.getresponse()
        result = response.read()
        
        code.HttpConnectionClose(conn)
        return result
 