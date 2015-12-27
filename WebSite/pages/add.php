<div class="add" style="margin-left:50px;">
    <form method="POST" action="addRecipes.php">
    Title
    <input type="text" name="title" required/>
    <p style="margin-top:12px; margin-bottom: 0px;">Ingredients:</p>
    <div class="ingredients">
        <table>
        <tr>
            <td style="text-align: center; margin-bottom: 0px;">ingredient</td>
            <td style="text-align: center; margin-bottom: 0px;">count</td>
            <td style="text-align: center; margin-bottom: 0px;">measure</td>
        </tr>
        <tr>
            <td><input type="text" name="ingredient" required/></td>
            <td><input type="text" name="count" required/></td>
            <td><select name="measure">
                <option value="-">-</option>
                <option value="ml">ml</option>
                <option value="g">g</option>
        </select></td>
        </tr>
        </table>
    </div>
    <p style="margin-bottom: 0px; margin-top: 12px;">How to cook:</p>
    <textarea name="instruction" rows="10" cols="40"></textarea>
    <input type="submit" value="Add recipe" name="add"/>
</form>
</add>

