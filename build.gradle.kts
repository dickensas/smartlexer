plugins {
    java
    id("org.jetbrains.kotlin.jvm") version "1.8.10"
    application
}

repositories {
    mavenCentral()
}

var currentOS = org.gradle.internal.os.OperatingSystem.current()
var platform = "win"
var javafxVersion = "20"
if (currentOS.isWindows()) {
    platform = "win"
} else if (currentOS.isLinux()) {
    platform = "linux"
} else if (currentOS.isMacOsX()) {
    platform = "mac"
}

val avatarJs by configurations.creating

val openjfx by configurations.creating

dependencies {
    implementation(platform("org.jetbrains.kotlin:kotlin-bom"))

    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("com.google.guava:guava:31.1-jre")
    
    implementation("org.openjfx:javafx-base:${javafxVersion}:${platform}")
    implementation("org.openjfx:javafx-graphics:${javafxVersion}:${platform}")
    implementation("org.openjfx:javafx-controls:${javafxVersion}:${platform}")
    implementation("org.openjfx:javafx-fxml:${javafxVersion}:${platform}")
    implementation("org.openjfx:javafx-media:${javafxVersion}:${platform}")
    implementation("org.openjfx:javafx-web:${javafxVersion}:${platform}")
    
    openjfx("org.openjfx:javafx-base:${javafxVersion}:${platform}")
    openjfx("org.openjfx:javafx-graphics:${javafxVersion}:${platform}")
    openjfx("org.openjfx:javafx-controls:${javafxVersion}:${platform}")
    openjfx("org.openjfx:javafx-fxml:${javafxVersion}:${platform}")
    openjfx("org.openjfx:javafx-media:${javafxVersion}:${platform}")
    openjfx("org.openjfx:javafx-web:${javafxVersion}:${platform}")
    
    avatarJs("com.oracle:avatar-js:0.10.25-SNAPSHOT")
    avatarJs("com.oracle:libavatar-js-${platform}-x64:0.10.25-SNAPSHOT")

}

application {
    mainClassName = "com.zigma.App"
    applicationDefaultJvmArgs = listOf(
        "--module-path=fxlib",
        "--add-modules=javafx.controls,javafx.fxml,javafx.web"
    )
}

tasks.withType<JavaExec> {
    main  = "com.zigma.App"
    dependsOn("copyFXLibs")
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
    
    register("copyFXLibs", Copy::class) {
        from(openjfx)
        into("fxlib")
    }
}