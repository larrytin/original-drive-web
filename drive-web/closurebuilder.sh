src/main/webapp/good.js/closure-library/closure/bin/build/closurebuilder.py \
  --root=src/main/webapp/good.js/closure-library/ \
  --root=src/main/webapp/good.js/good/ \
  --root=src/main/webapp/good/ \
  --namespace="good.drive.demo" \
  --output_mode=compiled \
  --compiler_jar=compiler.jar \
  --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
  > src/main/webapp/good/compiled.js

##  --compiler_jar=$HOME/.m2/repository/com/google/javascript/closure-compiler/v20130603/closure-compiler-v20130603.jar \
