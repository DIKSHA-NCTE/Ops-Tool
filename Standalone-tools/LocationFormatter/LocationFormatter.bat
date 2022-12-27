
REM ****************************** CUSTOMIZE FOLLOWING LINES *************************
SET JAVA_HOME=C:\Program Files\Java\jdk1.8.0_271
SET LIB_PATH=C:\D\DesktopTools\LocationFormatter\lib

REM *********************************DO NOT CHANGE FOLLOWING LINES ****************************** 
SET PATH=%JAVA_HOME%\bin;
SET CLASSPATH=%LIB_PATH%\commons-csv-1.5.jar;%LIB_PATH%\Custom.jar;


REM ***************** Set the data folder path appropriately *********
java -cp %CLASSPATH% ntp.test.LocationFormatterCluster

PAUSE
