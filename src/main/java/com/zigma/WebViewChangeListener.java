package com.zigma;

import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Worker;
import javafx.scene.Scene;

class WebViewChangeListener implements ChangeListener<Worker.State> {
	private Scene scene;
	private JavaConnector connector;
	
	public WebViewChangeListener(Scene scene) {
		this.scene = scene;
	}
	
	public Scene getScene() {
        return scene;
    }
	
	public JavaConnector getConnector() {
        return connector;
    }
	
	@Override
	public void changed(ObservableValue<? extends Worker.State> observable, Worker.State oldValue, Worker.State newValue) {
	    if(newValue.toString().equals("SUCCEEDED")) {
	        this.connector = new JavaConnector(scene);
	    }
	}
}