#!/bin/bash
#OKMSG="Already up-to-date."
#REPOSTAT=`git pull`
#if [[ "z$REPOSTSAT" == "z$OKMSG" ]] ; then
#	echo "Match"
#else 
#	echo "No Match!"
#	echo "|$REPOSTAT| <> |$OKMSG|"
#fi




while [[ 1 -eq 1 ]]
do

  date &> cd.log

  echo "pulling" &>>cd.log
  git pull &>>cd.log
  echo "pushing" &>> cd.log
  git push heroku master &>> cd.log

  echo "sleeping" &>> cd.log
  date &>> cd.log
  sleep 600
done 
