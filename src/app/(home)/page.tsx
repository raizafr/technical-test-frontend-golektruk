"use client";

import { analytic } from "@/service/api";
import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import CsvDownloader from "react-csv-downloader";

export default function Home() {
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [allDataAnalytic, setAllDataAnalytic] = useState<any[]>([]);
  const token = getToken();

  useEffect(() => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const getAnalytic = async () => {
      if (token && fromDate && toDate) {
        const dateRange = getDatesBetween(fromDate, toDate);

        for (const date of dateRange) {
          await delay(1000);
          const response = await analytic(token, date);
          setAllDataAnalytic((prevData) => [...prevData, response]);
        }
      }
    };
    getAnalytic();
  }, [token, fromDate, toDate]);

  const flattenedArray = allDataAnalytic.flat();
  const uniqueScopes = [...new Set(flattenedArray.map((item) => item.scope))];

  const getDatesBetween = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateArray = [];

    let currentDate = startDate;
    while (currentDate <= endDate) {
      dateArray.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  };

  const columns = uniqueScopes
    ?.filter((item: any) => item !== undefined)
    ?.map((item: string, i: number) => ({ id: item, displayName: item }));
  const setCoulumn = [
    {
      id: "tahun",
      displayName: "Tahun",
    },
    ...columns,
  ];

  const itemDataExcel = (index: number) => {
    return Array.isArray(allDataAnalytic[index])
      ? allDataAnalytic[index]?.map((item: any, i: number) => ({
          [item.scope]: item.count,
        }))
      : null;
  };

  const datas =
    fromDate && toDate
      ? getDatesBetween(fromDate, toDate)?.map((item: any, i: number) => {
          const dataExcel = itemDataExcel(i);
          return {
            tahun: item,
            ...(dataExcel ? Object.assign({}, ...dataExcel) : {}),
          };
        })
      : null;

  return (
    <section className="container mx-auto px-3 md:px-5 lg:px-20">
      <div className="pt-20">
        <div className="flex justify-between items-center">
          <h1>Analytic</h1>
          {datas && columns && (
            <CsvDownloader
              filename="myfile"
              extension=".csv"
              columns={setCoulumn}
              datas={datas}
              text="DOWNLOAD"
            >
              <button className="btn">Export</button>
            </CsvDownloader>
          )}
        </div>
        <div className="flex items-center gap-2 border w-fit px-2 py-1 rounded-xl">
          <div>Pilih Range: </div>
          <div className="space-x-2">
            <input
              type="date"
              onChange={(e) => setFromDate(e.target.value)}
              id="dateFrom"
              name="dateFrom"
            />
            <span>-</span>
            <input
              type="date"
              onChange={(e) => setToDate(e.target.value)}
              id="dateTo"
              name="dateTo"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {allDataAnalytic.length == 0 ? (
            <div className="text-center">
              Data not Found, pilih range untuk menampilkan data
            </div>
          ) : (
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th></th>
                  <th>Tahun</th>
                  {uniqueScopes
                    .filter((item) => item !== undefined)
                    ?.map((item: any, i: number) => (
                      <th key={i}>{item}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {fromDate &&
                  toDate &&
                  getDatesBetween(fromDate, toDate)?.map(
                    (item: any, i: number) => (
                      <tr key={i}>
                        <th>{i + 1}</th>
                        <td>{item}</td>
                        {Array.isArray(allDataAnalytic[i]) ? (
                          allDataAnalytic[i].map((item: any, j: number) => (
                            <td key={j}>{item?.count}</td>
                          ))
                        ) : (
                          <td></td>
                        )}
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
