build:
	cargo fmt
	cargo build --release

	
words: build    
	gcc ./examples/words.c -Isrc  -Ltarget/release -lbotnana -o botnana
	./botnana 
	
empty: build
	-rm *.o botnana
	gcc -Isrc -c ./examples/empty.c
	gcc empty.o -Ltarget/release -lbotnana -o botnana
	./botnana 

	
verbose: build    
	gcc ./examples/verbose.c -Isrc  -Ltarget/release -lbotnana -o botnana
	./botnana
	
slave_setting: build    
	gcc ./examples/slave_setting.c -Isrc  -Ltarget/release -lbotnana -o botnana
	./botnana
	
get_version: build    
	gcc ./examples/get_version.c -Isrc  -Ltarget/release -lbotnana -o botnana
	./botnana		
	
	
	
test: build    
	gcc ./examples/test.c -Isrc  -Ltarget/release -lbotnana -o botnana
	RUST_BACKTRACE=1 ./botnana			
	
clean:
	-rm *.o botnana		