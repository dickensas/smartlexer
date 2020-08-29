package com.zigma;

import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Worker;
import javafx.scene.Scene;

class WebViewChangeListener implements ChangeListener<Worker.State> {
	private Scene scene;
	
	public WebViewChangeListener(Scene scene) {
		this.scene = scene;
	}
	
	@Override
	public void changed(ObservableValue<? extends Worker.State> observable, Worker.State oldValue, Worker.State newValue) {
		new JavaConnector(scene);
	}
}