# export HOME=C:/Users/Administrator

cd src/main/webapp
good.js/closure-library/closure/bin/build/closurebuilder.py \
  --root=good.js/closure-library/ \
  --root=good.js/good/ \
  --root=good/ \
  --namespace="good.drive.init" \
  --output_mode=compiled \
  --compiler_jar=$HOME/.m2/repository/com/goodow/javascript/closure-compiler/v20130603-SNAPSHOT/closure-compiler-v20130603-SNAPSHOT.jar \
  --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
  --compiler_flags="--externs=good.js/good/realtime/realtime.externs.js" \
  --compiler_flags="--create_source_map=drive.js.map" \
  > drive-compiled.js
echo //@ sourceMappingURL=drive.js.map >> drive-compiled.js

