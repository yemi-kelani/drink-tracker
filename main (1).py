import json
import requests
import datetime
# url = "https://5zagbx91fe.execute-api.us-east-2.amazonaws.com/test"


def add_user(user_id):
  url = "https://5uzp4pscwzketoc5hvi3de4vwy0avosp.lambda-url.us-east-2.on.aws/"
  myobj = {"userid": user_id}

  # print("make request")
  x = requests.post(url, json=myobj)


def add_session(user_id):
  url = "https://anbpnyrabvdllurvo4urtbc2zu0cmiux.lambda-url.us-east-2.on.aws/"
  myobj = {
    "userid": user_id,
    "starttime": str(datetime.datetime.now()),
    "endtime": str(datetime.datetime.now())
  }
  x = requests.post(url, json=myobj)

  return int(x.text)


def add_drink(session_id):
  url = "https://f4ghrwj5dco2xkh52p67zwv3ti0egapg.lambda-url.us-east-2.on.aws/"
  myobj = {"sessionid": session_id, "drink_time": str(datetime.datetime.now())}
  x = requests.post(url, json=myobj)


def get_sessions(user_id):
  url = "https://joatokpmrnk2afdf6aldrutw6m0kwrqd.lambda-url.us-east-2.on.aws/"
  myobj = {"userid": user_id}
  x = requests.post(url, json=myobj)
  # print(eval(x.text))
  sessions = []
  for entry_item in eval(x.text):
    first_time = False
    times = eval(entry_item[1])
    if times == []:
      continue
    print(
      f"\nSession ID: {entry_item[0]}\nYou consumed drinks at the following times"
    )
    # print(entry_item[1])

    for time in times:
      if not first_time:
        first_time = time[0]
      time = time[0]
      last_time = time
      print(time)
    diff = last_time - first_time
    days, seconds = diff.days, diff.seconds
    hours = days * 24 + seconds / 3600
    print(
      f"In this session you consumed {len(times)} drinks in {hours:.4f} hours at an average rate of {len(times) / hours:.1f} drinks per hour"
    )


# add_user()
# add_session()
# add_drink()
# get_session(137)

# exit()
if __name__ == '__main__':
  user_id = int(input("Please enter your integer ID\n"))
  add_user(user_id)
  session_number = add_session(user_id)
  num_drinks = 0
  while 1:
    print("\n\nIf you would like to take a drink: enter 1.")
    print("If you would like to stop: enter 2")
    print("if you would like to see your drinking history: enter 3")
    cmd = int(input(">"))
    if cmd == 1:
      num_drinks += 1
      add_drink(session_number)
    elif cmd == 2:
      print(f"You have had {num_drinks} drinks today")
      break
    elif cmd == 3:
      get_sessions(user_id)