plugins {
    java

    application
}

repositories {
    maven(url="https://maven.java.net/content/repositories/public/")
    mavenCentral()
    jcenter()
}

var currentOS = org.gradle.internal.os.OperatingSystem.current()
var platform = "win"
if (currentOS.isWindows()) {
    platform = "win"
} else if (currentOS.isLinux()) {
    platform = "linux"
} else if (currentOS.isMacOsX()) {
    platform = "mac"
}

val avatarJs by configurations.creating

dependencies {
    implementation("com.google.guava:guava:29.0-jre")
    
    implementation("org.openjfx:javafx-base:14:${platform}")
    implementation("org.openjfx:javafx-graphics:14:${platform}")
    implementation("org.openjfx:javafx-controls:14:${platform}")
    implementation("org.openjfx:javafx-fxml:14:${platform}")
    implementation("org.openjfx:javafx-web:14:${platform}")
    avatarJs("com.oracle:avatar-js:0.10.25-SNAPSHOT")
    avatarJs("com.oracle:libavatar-js-${platform}-x64:0.10.25-SNAPSHOT")

}

application {
    mainClassName = "com.zigma.App"
    applicationDefaultJvmArgs = listOf(
        "--module-path=C:\\MyFiles\\javafx-sdk-11.0.2\\lib",
        "--add-modules=javafx.controls,javafx.fxml,javafx.web"
    )
}

tasks {
    register("runJs", Exec::class){
        dependsOn("copyLibs")
        println("runHelloWorld1")
        workingDir = projectDir
        // java -Djava.library.path=lib -jar lib/avatar-js.jar hello-world-server.js
        commandLine( 
                "java", 
                "-Djava.library.path=lib", 
                "-jar", "lib\\avatar-js-0.10.25-SNAPSHOT.jar", 
                "smartlexer.js",
                "source.sql",
                "EmitListener.js"
        )
        println("runHelloWorld1 finished")
    }
    register("copyLibs", Copy::class) {
        from(avatarJs)
        into("lib")
        rename("libavatar-js-win-x64-0.10.25-SNAPSHOT.dll", "avatar-js.dll")
    }
}