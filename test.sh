for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
do
	osascript -e 'tell app "Terminal"
	   do script "cd Developer/GitHub/IoP2015-Chord/\nnode chord.js 127.0.0.1 8452"
	end tell'
done

