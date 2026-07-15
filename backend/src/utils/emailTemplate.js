export const campaignEmailTemplate = (
    user,
    campaign
) => {

    return `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<style>

body{
    margin:0;
    padding:0;
    background:#f5f5f5;
    font-family:Arial,sans-serif;
}

.wrapper{
    width:100%;
    padding:30px 0;
}

.container{
    max-width:600px;
    margin:auto;
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 5px 20px rgba(0,0,0,.08);
}

.header{
    background:#111827;
    color:white;
    text-align:center;
    padding:35px;
}

.header h1{
    margin:0;
    font-size:32px;
}

.content{
    padding:35px;
    color:#374151;
}

.content h2{
    color:#111827;
}

.button{
    display:inline-block;
    margin-top:25px;
    padding:14px 28px;
    background:#2563eb;
    color:white !important;
    text-decoration:none;
    border-radius:6px;
    font-weight:bold;
}

.footer{
    background:#f3f4f6;
    text-align:center;
    padding:20px;
    color:#6b7280;
    font-size:13px;
}

</style>

</head>

<body>

<div class="wrapper">

<div class="container">

<div class="header">

<h1>🚗 CarShop</h1>

</div>

<div class="content">

<p>Hello <strong>${user.first_name}</strong>,</p>

<h2>${campaign.subject}</h2>

<p>

${campaign.content}

</p>

<a
href="http://localhost:5173/catalog"
class="button"
>

Shop Now

</a>

</div>

<div class="footer">

<p>

Thanks for choosing CarShop.

</p>

<p>

© ${new Date().getFullYear()} CarShop. All Rights Reserved.

</p>

</div>

</div>

</div>

</body>

</html>
`;

};