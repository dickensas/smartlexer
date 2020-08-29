package com.zigma;

import java.io.File;
import java.net.URL;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;

public class App extends Application {
	
	@Override
	public void start(Stage primaryStage) {
		try {
			Parent root = FXMLLoader.load(getClass().getResource("App.fxml"));
			Scene scene = new Scene(root);
			scene.getStylesheets().add(getClass().getResource("App.css").toExternalForm());
			primaryStage.setTitle("Smart Parser");
			primaryStage.setScene(scene);
			primaryStage.show();
			WebView webview = (WebView)scene.lookup("#mywebview");
			final WebEngine webEngine = webview.getEngine();
			
			webEngine.getLoadWorker().stateProperty().addListener(new WebViewChangeListener(scene));
			URL url = new File("./index.html").toURI().toURL();
			webEngine.load(url.toString());
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) {
		for(int i=0;i<args.length;i++) {
			System.out.println(args[i]);
		}
		launch(new String[] {});
	}
}
