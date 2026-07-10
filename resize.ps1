Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile('public\logo-blue.png')

$bgColor = [System.Drawing.Color]::FromArgb(255, 255, 255, 255)

$bmp1 = New-Object System.Drawing.Bitmap 192, 192
$g1 = [System.Drawing.Graphics]::FromImage($bmp1)
$g1.Clear($bgColor)
$scale1 = 150.0 / [math]::Max($src.Width, $src.Height)
$newW1 = [int]($src.Width * $scale1)
$newH1 = [int]($src.Height * $scale1)
$x1 = [int]((192 - $newW1) / 2)
$y1 = [int]((192 - $newH1) / 2)
$g1.DrawImage($src, $x1, $y1, $newW1, $newH1)
$bmp1.Save('public\pwa-192x192.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g1.Dispose()
$bmp1.Dispose()

$bmp2 = New-Object System.Drawing.Bitmap 512, 512
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.Clear($bgColor)
$scale2 = 400.0 / [math]::Max($src.Width, $src.Height)
$newW2 = [int]($src.Width * $scale2)
$newH2 = [int]($src.Height * $scale2)
$x2 = [int]((512 - $newW2) / 2)
$y2 = [int]((512 - $newH2) / 2)
$g2.DrawImage($src, $x2, $y2, $newW2, $newH2)
$bmp2.Save('public\pwa-512x512.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g2.Dispose()
$bmp2.Dispose()

$bmp3 = New-Object System.Drawing.Bitmap 512, 512
$g3 = [System.Drawing.Graphics]::FromImage($bmp3)
$g3.Clear($bgColor)
$g3.DrawImage($src, $x2, $y2, $newW2, $newH2)
$bmp3.Save('public\logo.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g3.Dispose()
$bmp3.Dispose()

$src.Dispose()
