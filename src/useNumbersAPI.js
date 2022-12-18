import { useState, useEffect } from "react";

/**
 * Custom Hook created to interface with Numbers API
 *
 * Accepts 2 parameters:
 *    number: the number you'd like a trivia fact for,
 *    options: an object containing additional fields to customize your query
 *
 *    options = {
 *        category: trivia, math, date, random (defaults to trivia)
 *        number: a single number (required)
 *        list: an array of individual numbers (optional)
 *        range: an array containing [min, max] (optional)
 *        custom: input your own parameter string based on the API documentation (optional)
 *      }
 *
 *    ~list and range selections are limited to 100 facts~
 *
 * */
export default function useNumbersAPI({ number = "42", category = false,
  list = false, range = false, custom = false, }) {
  // TODO: Add ability to say 'today', and JS gets date
  const [fact, setFact] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  /** Builds a parameter string from the options object */
  function parseOptions() {
    let paramString = "";
    if (range) {
      const [min, max] = range;
      paramString += `${min}..${max}`;
    }
    if (list) {
      if (range) {
        paramString += ",";
      }
      paramString += list.join(",");
    }
    if (category) {
      paramString += `${category}`;
    }
    return paramString;
  }

  useEffect(() => {
    const fetchData = async () => {
      let url;
      if (custom) {
        url = `http://numbersapi.com/${custom}`;
      } else {
        const params = parseOptions();
        url = `http://numbersapi.com/${number}/${params}`;
      }
      try {
        const response = await fetch(url);
        const data = await response.text();
        setFact(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [number, category, list, range, custom]);

  if (loading) {
    return "Loading...";
  }
  if (error) {
    return "Error...";
  }
  return fact;
}