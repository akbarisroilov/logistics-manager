export const Functions = {
  getDate: () => {
    let d = new Date();
    // convert to msec since Jan 1 1970
    let localTime = d.getTime();
    // obtain local UTC offset and convert to msec
    let localOffset = d.getTimezoneOffset() * 60000;
    // obtain UTC time in msec
    let utc = localTime + localOffset;
    // obtain and add destination’s UTC time offset
    // for example, Bombay
    // which is UTC + 5.5 hours
    let offset = -4;
    let est = utc + 3600000 * offset;
    // convert msec value to date string
    let nd = new Date(est);

    return nd.getFullYear() + "-" + (nd.getMonth() + 1) + "-" + nd.getDate();
  },
};

export const dateToString = (date, format) => {
  // %y - year
  // %m - month
  // %d - day
  // %H - Hour
  // %M - Minute
  // %S - Second

  // look for %y
  if (format.includes("%y")) {
    var a = date.getFullYear();
    format = format.replace("%y", a);
  }
  // look for %m
  if (format.includes("%m")) {
    var a = date.getMonth() + 1;
    a = a < 10 ? "0" + a : a;
    format = format.replace("%m", a);
  }
  // look for %d
  if (format.includes("%d")) {
    var a = date.getDate();
    a = a < 10 ? "0" + a : a;
    format = format.replace("%d", a);
  }
  // look for %H
  if (format.includes("%H")) {
    var a = date.getHours();
    a = a < 10 ? "0" + a : a;
    format = format.replace("%H", a);
  }
  // look for %M
  if (format.includes("%M")) {
    var a = date.getMinutes();
    a = a < 10 ? "0" + a : a;
    format = format.replace("%M", a);
  }
  // look for %S
  if (format.includes("%S")) {
    var a = date.getSeconds();
    a = a < 10 ? "0" + a : a;
    format = format.replace("%S", a);
  }
  return format;
};

export const stringToDateTime = (str, initial) => {
  /*
  today
  tomorrow
  yesterday
  n days before
  n days later
  n month before 
  n month later
  beginning week
  beginning month
  no time
  */
  let date = initial ? new Date(initial) : new Date();
  let allArgs = str.split(" & ");

  

  for (let a of allArgs) {
    let args = a.split(" ");

    if (args.includes("today")) {
      // changes nothing *
    }
    if (args.includes("tomorrow")) {
      date.setDate(date.getDate() + 1)
    }
    
    if (args.includes("beginning")) {
      if (args[1] === "week") date.setDate(date.getDate() - date.getDay());
      if (args[1] === "month") date.setDate(1);
    }
  
    if (args[1] === "days") {
      date.setDate(args[2] === "before" ? date.getDate() - parseInt(args[0]) : args[2] === "later" ? date.setDate(date.getDate() + parseInt(args[0])) : date.getDate());
    }
    if (args[1] === "month") {
      date.setMonth(args[2] === "before" ? date.getMonth() - parseInt(args[0]) : args[2] === "later" ? date.setDate(date.getMonth() + parseInt(args[0])) : date.getMonth())
    }

    if (args[0] === "no") {
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
    }
  }

  return date;
}

export const getName = (id, list) => {
  for (let l of list) {
    if (l.id === id) return l.name;
  }
  return "";
};

export const getFullName = (id, names) => {
  for (let name of names) {
    if (name.id === id) return name.first_name + " " + name.last_name;
  }
  return "";
};

export const getUsername = (id, names) => {
  for (let name of names) {
    if (name.id === id) return name.username;
  }
  return "";
};

export const getNumber = (id, names) => {
  for (let name of names) {
    if (name.id === id) return name.number;
  }
  return "";
}

export const getChoice = (choice, choices) => {
  let found = "*not found";
  Object.keys(choices).forEach((ch) => {
    if (ch === choice) {
      found = choices[ch];
    }
  });
  return found;
};

export const fixDate = (dateTime) => {
  const time = new Date(dateTime);
  return time.toLocaleDateString() + " - " + time.toLocaleTimeString();
};

export const is_updated = (index, data, attr) => {
  return index != 0 && data[index - 1][attr] != data[index][attr];
};
