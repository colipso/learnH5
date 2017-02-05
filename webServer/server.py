#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Wed Feb  1 15:53:05 2017

@author: hp
"""

import web
import random
import json

urls = (
    '/getData/', 'getData'
)

class getData:
    def GET(self):
        web.header('Content-Type', 'application/javascript;charset=utf-8')
        callback = web.input().get('jsoncallback','onGetMessages')
        print web.input()
        print callback
        returnText = "The return Data is " + str(int(random.random() *100) ) 
        return "%s(%s)" %(callback,json.dumps(returnText)) 

if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()