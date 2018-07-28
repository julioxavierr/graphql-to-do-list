# Rename all *.txt to *.text
for f in *.js; do 
    mv -- "$f" "${f%.js}.ts"
done
