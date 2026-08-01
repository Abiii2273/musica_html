<%@ WebHandler Language="C#" Class="MusicList" %>

using System;
using System.Web;
using System.IO;
using System.Text;
using System.Collections.Generic;

public class MusicList : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json";
        string musicFolder = context.Server.MapPath("~/Musica/");

        if (!Directory.Exists(musicFolder))
        {
            context.Response.Write("[]");
            return;
        }

        var files = new List<string>();
        RecorrerCarpeta(musicFolder, ref files);

        var sb = new StringBuilder();
        sb.Append("[");
        for (int i = 0; i < files.Count; i++)
        {
            string fullPath = files[i];
            string relativePath = fullPath.Substring(musicFolder.Length).Replace('\\', '/');
            string finalPath = "Musica/" + relativePath;
            string nombre = Path.GetFileNameWithoutExtension(fullPath);

            sb.Append("{");
            sb.Append(string.Format("\"titulo\":\"{0}\",", EscapeJson(nombre)));
            sb.Append(string.Format("\"archivo\":\"{0}\",", EscapeJson(finalPath)));
            sb.Append("\"album\":\"Carpeta local\"");
            sb.Append("}");

            if (i < files.Count - 1) sb.Append(",");
        }
        sb.Append("]");
        context.Response.Write(sb.ToString());
    }

    private void RecorrerCarpeta(string currentFolder, ref List<string> lista)
    {
        string[] extensiones = { "*.mp3", "*.wav", "*.ogg" };
        foreach (string ext in extensiones)
        {
            foreach (string file in Directory.GetFiles(currentFolder, ext))
            {
                lista.Add(file);
            }
        }
        foreach (string subDir in Directory.GetDirectories(currentFolder))
        {
            RecorrerCarpeta(subDir, ref lista);
        }
    }

    private string EscapeJson(string s)
    {
        if (string.IsNullOrEmpty(s)) return "";
        return s.Replace("\\", "\\\\")
                .Replace("\"", "\\\"")
                .Replace("\n", "\\n")
                .Replace("\r", "\\r")
                .Replace("\t", "\\t");
    }

    public bool IsReusable
    {
        get { return false; }
    }
}