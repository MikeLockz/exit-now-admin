
## Interaction Cycle
1. Http Init
   a. Register push socket on server for user
2. Http - Enter Destination
	a. REqquest: Speeds, Conditions, Go-NoGo?, Explanation?
	b. Display: Go-NoGo, Drive Bar
2. Http: Change Threshold
   a. Update Go-NoGo
3. Request Deals By:
   a. Current Location 
      - App will do this on latLng intervals
      - User request
   b. Down the Road Location
4. Push Deal Updates When:
   a. Business removes deal when over capacity
   a. Business creates a hot deal
   b. Traffic slows down or stops
5. Always Push
   a. Speeds
   b. Conditions
   c. Alerts?
6. Quit
   a. On lack of activity
   b. Quit button?
   c. Server can release push socket
