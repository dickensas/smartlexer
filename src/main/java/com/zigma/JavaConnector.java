package com.zigma;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URL;

import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TextArea;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import netscape.javascript.JSObject;

public class JavaConnector {
	protected static JSObject javascriptConnector;
	protected static Scene scene;
	public JavaConnector(final Scene scene) {
		this.scene = scene;
		
        WebView webview = (WebView)this.scene.lookup("#mywebview");
		final WebEngine webEngine = webview.getEngine();
		
		JSObject window = (JSObject) webEngine.executeScript("window");
        window.setMember("javaConnector", this);
		javascriptConnector = (JSObject) webEngine.executeScript("getJsConnector()");
		
        Button button = (Button) this.scene.lookup("#mybutton");
        button.setVisible(true);
        InputStream fis = null;
        try {
        	fis = new FileInputStream(new File("./database.json"));
        	String database = new String(fis.readAllBytes(), "UTF-8");
			javascriptConnector.call("setJSON", "database", database);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(fis!=null) {
				try {
					fis.close();
				} catch (Exception e) {
				}
			}
		}
	}
	public void log(String txt) {
		System.out.println(txt);
	}
	public void showLex(String sql) {
		TextArea txt = (TextArea) this.scene.lookup("#trgLex");
        txt.setText(sql);
	}
	public JSObject emit(JSObject obj) {
		System.out.println(obj);
		if(obj.getMember("type")=="MemberExpression") {
			JSObject object = (JSObject)obj.getMember("object");
			JSObject property = (JSObject)obj.getMember("property");
		}else if(obj.getMember("type")=="SequenceExpression") {
			JSObject expressions = (JSObject)obj.getMember("expressions");
		}
		return obj;
	}
}
