export JAVA_HOME=/home/tanweer/Documents/jdk1.8.0_221
export LIB_PATH=/home/tanweer/Downloads/LocationFormatter/lib
export CLASSPATH=.:${LIB_PATH}/commons-csv-1.5.jar:${LIB_PATH}/Custom.jar

java -cp $CLASSPATH ntp.test.LocationFormatterCluster CUI
